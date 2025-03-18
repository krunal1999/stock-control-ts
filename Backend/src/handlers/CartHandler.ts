import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/api-response";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../models/Cart";
import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../models/Orders";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId, quantity } = req.body;
    const userRef = req.user?.userId;
    console.log("userRef", userRef);

    const product = await Product.findById(productId);
    // console.log("product", product);

    if (!product) {
      return res.status(404).json(new ApiError("Product not found", 404));
    }

    const cart = await Cart.findOne({ userRef });

    if (cart) {
      const productExists = cart.products.some(
        (p) => p.productId.toString() === productId
      );

      if (productExists) {
        cart.products = cart.products.map((p) =>
          p.productId.toString() === productId
            ? {
                ...p,
                quantity: p.quantity + quantity,
                totalPrice: p.sellPrice * (p.quantity + quantity),
              }
            : p
        );
        cart.grandTotal = cart.products.reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        );
        await cart.save();
      } else {
        cart.products.push({
          productId: productId,
          productName: product?.productName,
          quantity: quantity,
          sellPrice: Number(product?.sellPrice),
          totalPrice: Number(product?.sellPrice) * quantity,
        });
        cart.grandTotal = cart.products.reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        );
        await cart.save();
      }
    } else {
      const newCart = new Cart({
        userRef: userRef,
        products: [
          {
            productId: productId,
            productName: product?.productName,
            quantity: quantity,
            sellPrice: Number(product?.sellPrice),
            totalPrice: Number(product?.sellPrice) * quantity,
          },
        ],
        grandTotal: Number(product?.sellPrice) * quantity,
      });
      await newCart.save();
    }

    res
      .status(200)
      .json(new ApiSuccess({ message: "Product added to cart" }, 200));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError("Failed to fetch categories", 500, error));
  }
};

export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userRef = req.user?.userId;
    const cart = await Cart.findOne({ userRef });
    if (!cart) {
      return res.status(200).json(new ApiSuccess("Cart Is Empty", 200));
    }
    res.status(200).json(new ApiSuccess(cart, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch cart", 500, error));
  }
};

export const updateCart = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId, quantity } = req.body;
    const userRef = req.user?.userId;

    const cart = await Cart.findOne({ userRef });
    if (!cart) {
      return res.status(404).json(new ApiError("Cart not found", 404));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(new ApiError("Product not found", 404));
    }

    const productExists = cart.products.some(
      (p) => p.productId.toString() === productId
    );

    if (!productExists) {
      return res
        .status(404)
        .json(new ApiError("Product not found in cart", 404));
    }

    cart.products = cart.products.map((p) =>
      p.productId.toString() === productId
        ? {
            ...p,
            quantity: quantity,
            totalPrice: Number(product?.sellPrice) * quantity,
          }
        : p
    );

    cart.grandTotal = cart.products.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0
    );
    await cart.save();

    res
      .status(200)
      .json(new ApiSuccess({ message: "Cart updated successfully" }, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to update cart", 500, error));
  }
};

export const deleteCart = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    // console.log(productId);
    const userRef = req.user?.userId;
    const cart = await Cart.findOne({ userRef });
    if (!cart) {
      return res.status(404).json(new ApiError("Cart not found", 404));
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );
    // console.log(cart.products);
    cart.grandTotal = cart.products.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0
    );

    if (cart.products.length === 0) {
      await cart.deleteOne();
      return res
        .status(200)
        .json(new ApiSuccess({ message: "Cart is empty" }, 200));
    }
    await cart.save();

    res
      .status(200)
      .json(new ApiSuccess({ message: "Product removed from cart" }, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to delete cart", 500, error));
  }
};

export const checkoutCart = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userRef = req.user?.userId;
    const cart = await Cart.findOne({ userRef });
    if (!cart) {
      return res.status(200).json(new ApiSuccess("Cart Is Empty", 200));
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.products.map((p) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: p.productName,
          },
          unit_amount: p.sellPrice * 100,
        },
        quantity: p.quantity,
      })),

      success_url: `${process.env.FRONTEND_URL}/user/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/user/checkout/cancel`,
    });
    // res.redirect(session.url || "");
    res.json({ url: session.url });
    console.log(session);
  } catch (error) {
    res.status(500).json(new ApiError("Failed to checkout", 500, error));
  }
};

export const checkoutSuccess = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    //take the seesion id from the url
    const sessionId = req.query.session_id as string;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // console.log(session);

    // get the cart and create an order
    const userRef = req.user?.userId;
    const cart = await Cart.findOne({ userRef });
    if (!cart) {
      return res.status(200).json(new ApiSuccess("Cart Is Empty", 200));
    }

    const newOrder = new Order({
      userRef,
      products: cart.products,
      totalPaid: session.amount_total ? session.amount_total / 100 : 0,
      status: session.payment_status === "paid" ? "Paid" : "Unpaid",
      orderStatus: "Pending",
      paymentMethod: session.payment_method_types?.[0] || "Card",
      paymentId: session.payment_intent || "",
    });
    const savedOrder = await newOrder.save();
    if (!savedOrder) {
      return res.status(500).json(new ApiError("Failed to create order", 500));
    }

    //clear the cart
    await Cart.findOneAndDelete({ userRef });

    // res.json({ session });
    res.status(200).json(new ApiSuccess("Order created successfully", 200));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to checkout", 500, error));
  }
};
