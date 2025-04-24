// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between z-50">
      <h1 className="text-xl font-bold">Architect</h1>
      <div className="text-sm text-gray-600">Welcome, Alina</div>
    </header>
  );
}

export default Header;
