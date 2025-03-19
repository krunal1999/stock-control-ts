import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/api-response";
import Order from "../models/Orders";
import Product from "../models/Product";
import { generateInvoice } from "../utils/invoiceGenerator";
import user from "../models/user";
import { sendEmail } from "../utils/sendEmails";

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orders = await Order.find().populate("userRef", "fullName email");
    res.status(200).json(new ApiSuccess(orders, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch orders", 500, error));
  }
};

export const getAllDeliveryOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orders = await Order.find()
      .populate("userRef", "fullName email")
      .populate({
        path: "products.productId",
        select: "productName category stock sellPrice locations",
        populate: {
          path: "locations",
          select: "location",
        },
      });

    res.status(200).json(new ApiSuccess(orders, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch orders", 500, error));
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let isStockAvailable = true;
    for (const item of order.products) {
      const product = await Product.findById(item.productId._id);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId._id}` });
      }

      if (Number(product.stock) < item.quantity) {
        isStockAvailable = false;
        break;
      }
    }

    if (!isStockAvailable) {
      order.orderStatus = "Hold";
      await order.save();
      return res.status(400).json({
        message:
          "Insufficient stock for one or more products. Order put on Hold.",
      });
    }

    for (const item of order.products) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        product.stock = (
          Number(product.stock) - Number(item.quantity)
        ).toString();
        await product.save();
      }
    }

    order.orderStatus = "Delivered";
    const savedOrder = await order.save();

    const user1 = await user.findById(order.userRef);

    const invoicePath = await generateInvoice({
      orderId: savedOrder?._id as string,
      userName: user1?.fullName || "",
      userEmail: user1?.email || "",
      paymentId: savedOrder.paymentId || "",
      totalPaid: savedOrder.totalPaid || 0,
      status: savedOrder.status || "",
      orderStatus: savedOrder.orderStatus || "",
      products: savedOrder.products,
    });

    const emailSubject = `Order Delivered  - ${savedOrder._id}`;
    const emailContent = `
  <h2>Hi ${user1?.fullName},</h2>
  <p>Thank you for your order! 🎉 Your Order was successful.</p>
  
  <h3>Order Details:</h3>
  
  <p><strong>Payment ID:</strong> ${savedOrder.paymentId}</p>
  <p><strong>Total Paid:</strong> £${savedOrder.totalPaid.toFixed(2)}</p>
  <p><strong>Payment Status:</strong> ${savedOrder.status}</p>
  <p><strong>Order Status:</strong> ${savedOrder.orderStatus}</p>

  <h3>Products Ordered:</h3>
  <ul>
    ${savedOrder.products
      .map(
        (p) =>
          `<li>${p.productName} - Quantity: ${
            p.quantity
          } - Price: £${p.sellPrice.toFixed(2)}</li>`
      )
      .join("")}
  </ul>

  <p>Thank you for shopping with us.</p>
`;
    // Send the email
    const emailSent = await sendEmail(
      user1?.email || "",
      emailSubject,
      emailContent,
      "Order Deliverd",
      invoicePath
    );

    if (!emailSent) {
      return res.status(500).json(new ApiError("Failed to send email", 500));
    }

    res
      .status(200)
      .json(new ApiSuccess({ message: "Order delivered successfully" }, 200));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError("Failed to update order status", 500, error));
  }
};
