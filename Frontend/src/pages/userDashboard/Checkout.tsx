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
          {cart.products?.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border-b py-3 dark:border-gray-700"
            >
              <span className="text-lg font-semibold">{item.productName}</span>
              <span className="text-lg">Qty: {item.quantity}</span>
              <span className="text-lg font-semibold">
                ${item.totalPrice.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="text-xl font-bold mt-4">
            Total: ${cart.grandTotal.toFixed(2)}
          </div>
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-600"
          >
            Proceed to Pay
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Checkout;
