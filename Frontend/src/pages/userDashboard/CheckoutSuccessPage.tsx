import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import cartService from "../../services/CartServicec";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  //   const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      try {
        const response = await cartService.checkoutSuccess(sessionId);
        console.log(response);
        // setSessionData(response.data);
      } catch (error) {
        console.error("Error fetching session details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-2 text-gray-700">Thank you for your purchase!</p>

      {/* {sessionData && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-100">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <p>
            <strong>Payment ID:</strong> {sessionData.id}
          </p>
          <p>
            <strong>Amount Paid:</strong> £
            {(sessionData.amount_total / 100).toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {sessionData.payment_status}
          </p>
        </div>
      )} */}

      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Return to Home
      </a>
    </div>
  );
};

export default CheckoutSuccess;
