"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const fetchUserDetails = async () => {
    const token = Cookies.get("access_token");
    if (token) {
      const response = await fetch("http://127.0.0.1:8000/api/user-details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserType(userData.is_normal_user ? "normal" : "restaurant");
      }
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails();
    }
  }, []);

  const login = async () => {
    setIsLoggedIn(true);
    await fetchUserDetails(); // Fetch user details after login
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null); // Reset userType on logout
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
