import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const history = useHistory();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://82.208.20.218:5000/login", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.message === "Login successful") {
        login(res.data.user);
        history.push("/dashboard");
      } else {
        setError(res.data.message || "Login failed1");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed2");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
