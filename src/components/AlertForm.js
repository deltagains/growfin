import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const conditionOptions = {
  stock: [
    { label: "Stock Price falls below", value: "Stock Price Below" },
    { label: "Stock Price rises above", value: "Stock Price Above" }
  ],
  option: [
    { label: "Net Delta is greater than", value: "netDelta" },
    { label: "Bullish Delta is greater than", value: "bullishDelta" },
    { label: "Bearish Delta is greater than", value: "bearishDelta" }
  ]
};

const AlertForm = ({ type = "stock" }) => {
  const location = useLocation();
  const stockname = location.pathname.split("/")[2]; // from /stock/ADANIPORTS
  const { user } = useAuth();  
  const [selectedCondition, setSelectedCondition] = useState(conditionOptions[type][0].value);
  const [floatValue, setFloatValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      stockname: stockname,
      conditions: selectedCondition,
      value: parseFloat(floatValue)
    };
  
    try {
      const res = await fetch(`${user?.user_api_url}/add_alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert(result.message || "Alert set successfully!");
      } else {
        alert(result.error || "Failed to set alert.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network or server error occurred.");
    }
  };  
  

  return (
    <Form onSubmit={handleSubmit}>
    <FormGroup className="row align-items-center">
        <div className="col-md-6">
        <Label>Condition</Label>
        <Input
            type="select"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
        >
            {conditionOptions[type].map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </Input>
        </div>

        <div className="col-md-4">
        <Label>Value</Label>
        <Input
            type="number"
            step="any"
            value={floatValue}
            onChange={(e) => setFloatValue(e.target.value)}
            required
        />
        </div>

        <div className="col-md-2 mt-4">
        <Button color="warning" type="submit" className="w-100">Set Alert</Button>
        </div>
    </FormGroup>
    </Form>

  );
};

export default AlertForm;

