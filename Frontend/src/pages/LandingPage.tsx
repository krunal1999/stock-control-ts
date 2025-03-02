import React from "react";
import { motion } from "framer-motion";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="hero min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./Images/backgroud1.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl bg-black/50  p-10 rounded-lg"
      >
        <h1 className="text-5xl font-bold text-white dark:text-light ">
          Welcome to MyBrand
        </h1>
        <p className="py-6 text-lg text-gray-200">
          A modern platform designed to enhance your experience. Join us and
          explore!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-button-primary text-button-text-light dark:bg-button-primary-hover dark:text-button-text-dark rounded-md hover:bg-button-primary-hover transition-all duration-300"
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 bg-background-light dark:bg-background-dark"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-primary dark:text-white">
          About Us
        </h2>
        <p className="mt-4 text-lg text-text-light dark:text-text-dark">
          We are dedicated to innovation and customer satisfaction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {["Our Mission", "Our Vision", "Why Choose Us?"].map(
            (title, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark shadow-lg rounded-lg hover:scale-105 transition-all duration-300"
              >
                <h3 className="text-xl font-bold">{title}</h3>
                <p>We aim to be a leader in technology and innovation.</p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: "24/7 Support",
      description: "Our team is always available to help.",
      icon: "🕒",
    },
    {
      title: "Easy Integration",
      description: "Connect with your tools easily.",
      icon: "🔗",
    },
    {
      title: "Scalability",
      description: "Our platform grows with you.",
      icon: "📈",
    },
  ];

  return (
    <section
      id="facilities"
      className="py-16 bg-background-light dark:bg-background-dark dark:text-white"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Facilities Provided</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-6 bg-gray-800 text-white shadow-lg rounded-lg hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-bold">
                {feature.icon} {feature.title}
              </h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="py-16 bg-background-light dark:bg-background-dark dark:text-white"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-primary dark:text-white">
          Contact Us
        </h2>
        <p className="mt-4 text-lg text-text-light dark:text-text-dark">
          Have any questions? Reach out to us!
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-10 dark:text-white">
          <div className="text-left max-w-md">
            <p className="text-lg font-semibold flex items-center">
              <HiLocationMarker className="mr-2 text-primary" /> 123 Tech
              Street, Innovation City
            </p>
            <p className="text-lg font-semibold mt-4 flex items-center">
              <HiPhone className="mr-2 text-primary" /> +1 (123) 456-7890
            </p>
            <p className="text-lg font-semibold mt-4 flex items-center">
              <HiMail className="mr-2 text-primary" /> info@mybrand.com
            </p>
          </div>

          <div className="max-w-md w-full bg-surface-light dark:bg-surface-dark p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-primary dark:text-primary-light text-center">
              Get in Touch
            </h3>
            <p className="text-text-light dark:text-text-dark text-center mb-6">
              We'd love to hear from you. Fill out the form below.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-text-light dark:text-text-dark text-sm font-medium text-left">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 mt-1 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-text-light dark:text-text-dark text-sm font-medium text-left">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  className="w-full p-3 mt-1 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-text-light dark:text-text-dark text-sm font-medium text-left">
                  Your Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full p-3 mt-1 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none transition-all h-32 resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-button-primary text-button-text-light dark:bg-primary dark:text-button-text-dark rounded-md hover:bg-button-primary-hover 
                dark:hover:bg-white dark:hover:text-black
                transition-all duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Alice", text: "Fantastic service! Highly recommended." },
    { name: "Bob", text: "Very user-friendly and responsive support." },
    {
      name: "Charlie",
      text: "A must-have for businesses and individuals alike.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-16 bg-surface-light dark:bg-surface-dark transition-all"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary dark:text-primary-light mb-6">
          What People Say About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark shadow-lg rounded-lg hover:scale-105 transition-all duration-300"
            >
              <p className="text-lg">{review.text}</p>
              <h4 className="mt-4 font-bold">{review.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <main className="transition-all">
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default LandingPage;
