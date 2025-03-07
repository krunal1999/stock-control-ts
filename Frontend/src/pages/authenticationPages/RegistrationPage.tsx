import { useState } from "react";
import { motion } from "framer-motion";
import { HiUser, HiMail, HiLockClosed, HiPhone } from "react-icons/hi";
import { RegisterFormData } from "types";
import authenticationServices from "../../services/AuthenticationServices";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = (): boolean => {
    let newErrors: Partial<RegisterFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!formData.email.includes("@") || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
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

      const response = await authenticationServices.registerUserByEmail(
        formData
      );

      // console.log(response);
      if (response.status !== 200) {
        console.log(response.data);
      }

      if (response.status === 200) {
        setMessage("Registration successful!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          mobile: "",
          gender: "",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-all">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-96 shadow-xl p-8 rounded-lg bg-surface-light dark:bg-surface-dark transition-all"
      >
        <h2 className="text-center text-2xl font-bold text-primary dark:text-primary-light">
          Register
        </h2>

        {message && <p className="text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Full Name Field */}
          <label className="input input-bordered flex items-center gap-3 bg-background-light dark:bg-background-dark">
            <HiUser className="text-primary dark:text-primary-light" />
            <input
              type="text"
              name="fullName"
              className="grow bg-transparent text-text-light dark:text-text-dark outline-none"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}

          {/* Email Field */}
          <label className="input input-bordered flex items-center gap-3 bg-background-light dark:bg-background-dark">
            <HiMail className="text-primary dark:text-primary-light" />
            <input
              type="email"
              name="email"
              className="grow bg-transparent text-text-light dark:text-text-dark outline-none"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          {/* Password Field */}
          <label className="input input-bordered flex items-center gap-3 bg-background-light dark:bg-background-dark">
            <HiLockClosed className="text-primary dark:text-primary-light" />
            <input
              type="password"
              name="password"
              className="grow bg-transparent text-text-light dark:text-text-dark outline-none"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          {/* Mobile Field */}
          <label className="input input-bordered flex items-center gap-3 bg-background-light dark:bg-background-dark">
            <HiPhone className="text-primary dark:text-primary-light" />
            <input
              type="text"
              name="mobile"
              className="grow bg-transparent text-text-light dark:text-text-dark outline-none"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </label>
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}

          {/* Gender Field */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="select w-full max-w-xs"
          >
            <option disabled value="">
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-button-primary text-button-text-light 
            dark:bg-button-primary
            dark:hover:bg-gray-200 dark:hover:text-black

            rounded-md 
            hover:bg-button-primary-hover transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
