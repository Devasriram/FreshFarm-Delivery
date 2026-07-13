import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read token from localStorage when the app starts
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Read customer details if stored
  const [customer, setCustomer] = useState(() => {
    const storedCustomer = localStorage.getItem("customer");
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });

  // Login
  const login = (jwtToken, customerData = null) => {
    localStorage.setItem("token", jwtToken);

    if (customerData) {
      localStorage.setItem("customer", JSON.stringify(customerData));
      setCustomer(customerData);
    }

    setToken(jwtToken);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");

    setToken(null);
    setCustomer(null);
  };

  // Keep state in sync if token changes externally
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        customer,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};