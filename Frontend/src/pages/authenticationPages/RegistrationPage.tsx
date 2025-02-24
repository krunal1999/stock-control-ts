import { useState } from "react";
import { motion } from "framer-motion";
import { HiUser, HiMail, HiLockClosed, HiPhone } from "react-icons/hi";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
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

          {/* Gender Field */}

          <select className="select w-full max-w-xs">
            <option disabled selected>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

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
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
