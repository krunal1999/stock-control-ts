import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll"; // Import react-scroll
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    if (location.pathname === "/") {
      scroll.scrollTo(document.getElementById(section)?.offsetTop || 0, {
        duration: 500,
        smooth: true,
      });
    } else {
      navigate("/");
      setTimeout(() => {
        scroll.scrollTo(document.getElementById(section)?.offsetTop || 0, {
          duration: 500,
          smooth: true,
        });
      }, 500);
    }
  };

  return (
    <nav className="bg-background-light dark:bg-background-dark shadow-md sticky top-0 z-50 transition-all">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <RouterLink
          to="/"
          className="text-3xl font-bold text-primary dark:text-primary-light transition-all"
        >
          <img src="./Images/logo2_rbg.png" alt="Logo" className="h-12" />
        </RouterLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg">
          {["Home", "About", "Facilities", "Testimonials", "Contact"].map(
            (item) => (
              <li key={item}>
                {/* <ScrollLink
                  to={`${item.toLowerCase()}`} // Matches the section ID
                  smooth={true}
                  duration={500}
                  offset={-70} // Adjusts for fixed navbar
                  className="cursor-pointer text-text-light dark:text-text-dark hover:text-primary transition duration-300"
                >
                  {item}
                </ScrollLink> */}
                <button
                  onClick={() => handleNavigation(item.toLowerCase())}
                  className="cursor-pointer text-text-light dark:text-text-dark hover:text-primary transition duration-300"
                >
                  {item}
                </button>
              </li>
            )
          )}
        </ul>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <RouterLink
            to="/login"
            className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-300 dark:text-white"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-300"
          >
            Register
          </RouterLink>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary dark:text-primary-light focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background-light dark:bg-background-dark shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {["Home", "About", "Facilities", "Testimonials", "Contact"].map(
              (item) => (
                <li key={item}>
                  <ScrollLink
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="cursor-pointer text-text-light dark:text-text-dark hover:text-primary transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </ScrollLink>
                </li>
              )
            )}
          </ul>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col items-center space-y-3 py-4">
            <RouterLink
              to="/login"
              className="w-4/5 text-center px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              className="w-4/5 text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Register
            </RouterLink>
          </div>

          {/* Theme Toggle Button */}
          <div className="flex justify-center py-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
