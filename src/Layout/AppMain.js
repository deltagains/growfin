import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "../components/Header";
import "./AppMain.css";

function AppMain({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  // Show full layout (header + sidebar) only if logged in and not on /login
  const isLoginPage = location.pathname === "/login";
  const showFullLayout = user && !isLoginPage;

  return (
    <div className="app-main-layout flex flex-col h-screen">
      {showFullLayout && <Header />}

      <div className="flex flex-1 overflow-hidden">
        {showFullLayout && <Sidebar />}
        <div className="main-content flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppMain;
