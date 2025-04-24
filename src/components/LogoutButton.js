// src/components/LogoutButton.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Make a POST request to your Flask backend to clear the session
      await axios.post("http://82.208.20.218:5000/logout", {
        withCredentials: true
      });

      logout(); // clear user from frontend context
      window.location.href = "/login"; // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;

