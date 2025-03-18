import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-6 text-center dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold text-red-600">Payment Canceled ❌</h1>
      <p className="mt-2 text-gray-700 dark:text-white">
        Your checkout process was canceled. If you need assistance, please
        contact support.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={() => navigate("/user/cart")}
      >
        Return to Cart
      </button>
      <br />
      <button
        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
        onClick={() => navigate("/user")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default CheckoutCancel;
