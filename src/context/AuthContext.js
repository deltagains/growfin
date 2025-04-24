import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Run this ONCE when app starts or reloads
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://82.208.20.218:5000/session", {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Login: set user and persist if needed
  const login = (userData) => {
    setUser(userData);
    // optional: store in localStorage
  };

  // Logout: remove from state and server
  const logout = async () => {
    setUser(null);
  await axios.get("http://82.208.20.218:5000/session", {
    withCredentials: true,
});
     
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
