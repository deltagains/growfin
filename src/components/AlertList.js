import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";

const AlertList = ({ type }) => {
  const location = useLocation();
  const stockname = location.pathname.split("/")[2]; // from /stock/ADANIPORTS
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!stockname) return;
    fetch(`${user?.user_api_url}/get_alerts?stockname=${stockname}&is_option=${type === "option"}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) {
          setAlerts(data.alerts);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [stockname, user]);

  const handleDelete = async (id) => {
    const res = await fetch(`${user?.user_api_url}/delete_alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } else {
      alert("Failed to delete alert.");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h5>Active Alerts for: {stockname}</h5>
      {alerts.length === 0 ? (
        <p>No alerts set.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={HeadStyle}>Condition</th>
              <th style={HeadStyle}>Value</th>
              <th style={HeadStyle}>Created At</th>
              <th style={HeadStyle}></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td style={cellStyle}>{alert.conditions}</td>
                <td style={cellStyle}>{alert.value}</td>
                <td style={cellStyle}>
                  {new Date(alert.created_at).toLocaleString()}
                </td>
                <td style={cellStyle}>
                  <FaTimes
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(alert.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};

const HeadStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  backgroundColor: "rgb(4, 58, 152)",
  color: "white"
};

export default AlertList;
