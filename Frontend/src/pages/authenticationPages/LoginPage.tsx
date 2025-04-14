import { useState } from "react";
import authenticationServices from "../../services/AuthenticationServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../store/useAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agree: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    agree?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; agree?: string } = {};

    if (!formData.email.includes("@") || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.agree) {
      newErrors.agree = "You must agree to the terms.";
    }

    // console.log(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      // Send request to backend
      const response = await authenticationServices.loginUserByEmail(formData);

      // console.log(response);

      if (response.status !== 200) {
        console.log(response.data);
      }

      if (response.status === 200) {
        setMessage("Login successful!");
        toast.success("Login successful!");

        // console.log(response.data.data.userData);
        const userRole = response.data.data.userData.role;
        login(userRole);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data.userData)
        );

        if (userRole === "admin" || userRole === "employee") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setMessage("Invalid login credentials.");
        toast.error("Invalid login credentials.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong. Please try again.");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-96 shadow-xl p-6 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-center text-lg font-semibold">Login</h2>

        {message && <p className="text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              name="email"
              className="grow bg-transparent text-gray-900 dark:text-white"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="password"
              name="password"
              className="grow bg-transparent text-gray-900 dark:text-white"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          <hr />
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              className="checkbox bg-gray-200"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label htmlFor="agree">I agree to the terms and conditions</label>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full text-white rounded-2xl"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
