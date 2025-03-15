import { createContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: "admin" | "user" | null;
  login: (role: "admin" | "user") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { role } = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  // Login function
  const login = (role: "admin" | "user") => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem("user", JSON.stringify({ role }));
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
