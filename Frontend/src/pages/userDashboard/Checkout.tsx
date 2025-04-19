import { useEffect, useState } from "react";
import cartService from "../../services/CartServicec";

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

const Checkout = () => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      //   console.log(response.data.data);
      setCart(response.data.data ? response.data.data : null);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const handlePayment = async () => {
    console.log("Proceed to payment for", cart);
    try {
      const response = await cartService.checkoutCart();
      // console.log(response);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error checking out", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg dark:bg-gray-900 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Checkout
      </h2>
      {cart && cart.products?.length > 0 ? (
        <div>
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 py-2 border-b dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300">
            <span className="col-span-6">Product</span>
            <span className="col-span-3 text-center">Quantity</span>
            <span className="col-span-3 text-right">Price</span>
          </div>

          {/* Product rows */}
          {cart.products?.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-12 gap-4 py-3 items-center border-b dark:border-gray-700"
            >
              <span className="col-span-6 text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                {item.productName}
              </span>
              <span className="col-span-3 text-lg text-center text-gray-700 dark:text-gray-300">
                Qty: {item.quantity}
              </span>
              <span className="col-span-3 text-lg font-semibold text-right text-gray-900 dark:text-gray-100">
                ${item.totalPrice.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Total row */}
          <div className="text-xl font-bold mt-4 text-right text-gray-900 dark:text-white">
            Total: ${cart.grandTotal.toFixed(2)}
          </div>

          {/* Payment button */}
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Proceed to Pay
          </button>
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400">
          Your cart is empty.
        </p>
      )}
    </div>
  );
};

export default Checkout;
