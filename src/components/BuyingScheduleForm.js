import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BuyingScheduleTable from "./BuyingScheduleTable";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormText,
} from "reactstrap";

const BuyingScheduleForm = () => {
  const location = useLocation();
  const { user } = useAuth();

  const stock_name = location.pathname.split("/")[2]; // from /stock/ADANIPORTS
  const user_api_url = user?.user_api_url;

  const [total_buy_steps, setTotalBuySteps] = useState("");
  const [no_of_lots, setNoOfLots] = useState("");
  const [target_stock_price, setTargetStockPrice] = useState("");
  const [strikeprice, setStrikePrice] = useState("");
  const [totalsellavgprice, setTotalSellAvgPrice] = useState("");
  const [addToAlerts, setAddToAlerts] = useState(false);

  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stock_name || !user_api_url) {
      console.error("Missing stock_name or user_api_url");
      alert("Something went wrong. Please ensure you're logged in.");
      return;
    }

    const payload = {
      stock_name,
      user_api_url,
      total_buy_steps,
      no_of_lots,
      target_stock_price,
      strikeprice: strikeprice !== "" ? parseFloat(strikeprice) : null,
      totalsellavgprice: totalsellavgprice !== "" ? parseFloat(totalsellavgprice) : null,
      addToAlerts,
    };
    

    setSubmittedPayload(payload); // Display submitted data

    try {
      const response = await fetch("http://82.208.20.218:5000/buying-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      //setApiResponse(data);
      setResponseData(data);


      if (!response.ok) {
        alert(`Error: ${data.error || "Something went wrong."}`);
      } 
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form. See console for details.");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                Total Buy Steps <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="number"
                value={total_buy_steps}
                onChange={(e) => setTotalBuySteps(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>
                No. of Lots <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="number"
                value={no_of_lots}
                onChange={(e) => setNoOfLots(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>
                Target Stock Price <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="number"
                value={target_stock_price}
                onChange={(e) => setTargetStockPrice(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Call Strike Price</Label>
              <Input
                type="number"
                value={strikeprice}
                onChange={(e) => setStrikePrice(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Call Sell Price</Label>
              <Input
                type="number"
                value={totalsellavgprice}
                onChange={(e) => setTotalSellAvgPrice(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup check className="mt-4">
              <Input
                type="checkbox"
                checked={addToAlerts}
                onChange={(e) => setAddToAlerts(e.target.checked)}
              />
              <Label check className="ms-2">Add to Alerts</Label>
            </FormGroup>
          </Col>
        </Row>

        <div className="mt-2">
          <FormText color="muted">
            <span style={{ color: "red" }}>*</span> Required
          </FormText>
        </div>  

        <div className="mt-3">
          <Button color="primary" type="submit">
            Set Buying Schedule
          </Button>
        </div>


      </Form>

      {/* Debug Output Below */}


      {responseData && (
        <div className="mt-4">
          <h5>Buying Schedule:</h5>
            <BuyingScheduleTable data={responseData} />
        </div>
      )}



    </>
  );
};

export default BuyingScheduleForm;
