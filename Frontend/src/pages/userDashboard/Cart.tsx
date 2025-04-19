import { useEffect, useState } from "react";
import cartService from "../../services/CartServicec";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CartProduct {
  productId: string;
  productName: string;
  quantity: number;
  sellPrice: number;
  totalPrice: number;
}

interface Cart {
  userRef: string;
  products: CartProduct[];
  grandTotal: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      //   console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const updateCart = async (productId: string, quantity: number) => {
    console.log(productId, quantity);
    try {
      const response = await cartService.updateCart(productId, quantity);
      console.log(response);
      if (response.status === 200) {
        toast.success("Cart updated successfully");
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart", error);
      toast.error("Error updating cart");
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!cart) return;
    if (quantity < 1) {
      removeItem(productId);
    } else {
      updateCart(productId, quantity);
    }
  };

  const removeItem = async (productId: string) => {
    // console.log(productId);
    try {
      const response = await cartService.deleteCart(productId);
      //   console.log(response);
      if (response.status === 200) {
        fetchCart();
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Error deleting cart", error);
      toast.error("Error deleting cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Shopping Cart
        </h2>
        {cart && cart.products?.length > 0 ? (
          <button
            onClick={() => navigate("/user/checkout")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Checkout
          </button>
        ) : null}
      </div>

      {cart && cart.products?.length > 0 ? (
        <div>
          <div className="grid grid-cols-5 gap-4 py-2 border-b dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Total</span>
            <span className="text-center">Action</span>
          </div>

          {cart.products.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-5 gap-4 py-3 items-center border-b dark:border-gray-700"
            >
              {/* Product Name */}
              <span className="text-lg text-gray-800 dark:text-gray-200 truncate">
                {item.productName}
              </span>

              {/* Price */}
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-300 text-center">
                ${item.sellPrice}
              </span>

              {/* Quantity Controls */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity - 1)
                  }
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  -
                </button>

                <span className="text-lg text-gray-800 dark:text-gray-200 w-8 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  +
                </button>
              </div>

              {/* Total Price */}
              <span className="font-semibold text-gray-900 dark:text-gray-200 text-center">
                ${item.totalPrice.toFixed(2)}
              </span>

              {/* Remove Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="hover:text-red-600 dark:hover:text-red-300 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Total */}
          <div className="text-xl font-bold mt-4 text-gray-900 dark:text-white">
            Total: ${cart.grandTotal.toFixed(2)}
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
