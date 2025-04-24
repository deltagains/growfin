import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, Table, Button, Form, FormGroup, Label, Input } from "reactstrap";
import classnames from "classnames";
import BuyingScheduleForm from "../components/BuyingScheduleForm";
import AlertForm from "../components/AlertForm";
import AlertList from "../components/AlertList";

const sampleStockData = [
  { quantity: 100, lots: 1, buyPrice: 1500, unrealizedPnL: 2000, lastTradedPrice: 1520 },
];

const sampleOptionData = [
  { expiry: "2024-06-30", type: "PUT", lots: 1, strikePrice: 1450, buyPrice: '', sellPrice: 48, lastTradedPrice: 47, delta: -0.4, theta: -0.01, unrealizedPnL: 300, potentialPnL: 500 },
  { expiry: "2024-07-30", type: "CALL", lots: 2, strikePrice: 1500, buyPrice: 50, sellPrice: '', lastTradedPrice: 54, delta: 0.6, theta: -0.02, unrealizedPnL: 500, potentialPnL: 700 },
  { expiry: "2024-07-30", type: "PUT", lots: 1, strikePrice: 1450, buyPrice: '', sellPrice: 48, lastTradedPrice: 47, delta: -0.4, theta: -0.01, unrealizedPnL: 300, potentialPnL: 500 },
];



const StockPage = () => {
  const { stockSymbol } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [optionTab, setOptionTab] = useState("1");
  const [orderType, setOrderType] = useState("LIMIT");
  const [buyingInterval, setBuyingInterval] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [optionData, setOptionData] = useState([]);

  const [strategy, setStrategy] = useState("Delta Pyramiding");

  const handleChange = async (event) => {
    const newStrategy = event.target.value;
    setStrategy(newStrategy);
    
    try {
      const response = await fetch(
        `https://deltagainsprod.pythonanywhere.com/update_strategy?strategy=${encodeURIComponent(newStrategy)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update strategy");
      }
      console.log("Strategy updated successfully");
    } catch (error) {
      console.error("Error updating strategy:", error);
    }
  };

  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("https://deltagainsprod.pythonanywhere.com/get_stock_positions", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockname: stockSymbol }),
        });
  
        if (!response.ok) {
          throw new Error(`Stock API error: ${response.status} ${response.statusText}`);
        }
  
        const text = await response.text(); // Read raw response first
        const data = text ? JSON.parse(text) : null; // Parse only if not empty
  
        if (!data || typeof data !== "object") {
          throw new Error("Invalid stock data format received");
        }
  
        setStockData(data);
      } catch (error) {
        console.error("Stock Data Fetch Error:", error.message);
        setStockData([]); // Ensure it's an array or expected type
      }
    };
  
    const fetchOptionData = async () => {
      try {
        const response = await fetch("https://deltagainsprod.pythonanywhere.com/get_option_positions", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockname: stockSymbol }),
        });
  
        if (!response.ok) {
          throw new Error(`Option API error: ${response.status} ${response.statusText}`);
        }
  
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
  
        if (!data || typeof data !== "object") {
          throw new Error("Invalid option data format received");
        }
  
        setOptionData(data);
      } catch (error) {
        console.error("Option Data Fetch Error:", error.message);
        setOptionData([]); // Fallback to empty array to avoid breaking UI
      }
    };
  
    if (stockSymbol) {
      fetchStockData();
      fetchOptionData();
    }
  }, [stockSymbol]);
  
  
  const stocklastTradedPrice = stockData.map(stock => stock.lastTradedPrice);
  const [buyFormData, setBuyFormData] = useState({
    expiry: "",
    lots: "",
    type: "",
    strikePrice: "",
    buyPrice: "",
    orderType: "Market",
  });
  
  const [sellFormData, setSellFormData] = useState({
    expiry: "",
    lots: "",
    type: "",
    strikePrice: "",
    sellPrice: "",
    orderType: "Market",
  });
  

  //const [activeTab, setActiveTab] = useState("POSITIONS");

  const handleSquareOff = (option) => {
    if (!option.buyPrice && option.sellPrice) {
      setBuyFormData({
        expiry: option.expiry || "",
        lots: option.lots || "",
        type: option.type || "",
        strikePrice: option.strikePrice || "",
        buyPrice: option.sellPrice || "", // Setting buy price from sell price
        orderType: "Market",
      });
      setOptionTab("2"); // Switch to BUY tab
    } else if (!option.sellPrice && option.buyPrice) {
      setSellFormData({
        expiry: option.expiry || "",
        lots: option.lots || "",
        type: option.type || "",
        strikePrice: option.strikePrice || "",
        sellPrice: option.buyPrice || "", // Setting sell price from buy price
        orderType: "Market",
      });
      setOptionTab("3"); // Switch to SELL tab
    }
  };
  
   
  const handleOrderSubmit = (event, type) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      QUANTITY: formData.get("quantity"),
      PRICE: orderType === "LIMIT" ? formData.get("price") : null,
      ORDERTYPE: type,
    };
    fetch("http://localhost/place_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <div>
      {/* Stock Holdings Section */}
      <Card>
        <CardBody>
          <h5>{stockSymbol} - STOCKS</h5>
          <Nav tabs>
            {["HOLDINGS", "BUY", "SELL", "BUYING SCHEDULE", "ALERTS"].map((tab, index) => (
              <NavItem key={index}>
                <NavLink className={classnames({ active: activeTab === String(index + 1) })} onClick={() => setActiveTab(String(index + 1))}>
                  {tab}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Table striped>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Lots</th>
                    <th>Buy Price</th>
                    <th>Unrealized PnL</th>
                    <th>Last Traded Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.quantity}</td>
                    <td>{stock.lots}</td>
                    <td>{stock.buyPrice}</td>
                    <td>{stock.unrealizedPnL}</td>
                    <td>{stock.lastTradedPrice}</td>
                  </tr>
                ))}
                </tbody>
              </Table>
            </TabPane>
            <TabPane tabId="2">
              <Form onSubmit={(e) => handleOrderSubmit(e, "BUY")}>
                <FormGroup>
                  <Label>Quantity</Label>
                  <Input type="number" name="quantity" required />
                </FormGroup>
                <FormGroup>
                  <Label>Order Type</Label>
                  <Input type="select" name="orderType" onChange={(e) => setOrderType(e.target.value)}>
                    <option>LIMIT</option>
                    <option>MARKET</option>
                  </Input>
                </FormGroup>
                {orderType === "LIMIT" && (
                  <FormGroup>
                    <Label>Price</Label>
                    <Input type="number" name="price" required />
                  </FormGroup>
                )}
                <Button color="success" type="submit">BUY</Button>
              </Form>
            </TabPane>
            <TabPane tabId="3">
              <Form onSubmit={(e) => handleOrderSubmit(e, "SELL")}>
                <FormGroup>
                  <Label>Quantity</Label>
                  <Input type="number" name="quantity" required />
                </FormGroup>
                <FormGroup>
                  <Label>Order Type</Label>
                  <Input type="select" name="orderType" onChange={(e) => setOrderType(e.target.value)}>
                    <option>LIMIT</option>
                    <option>MARKET</option>
                  </Input>
                </FormGroup>
                {orderType === "LIMIT" && (
                  <FormGroup>
                    <Label>Price</Label>
                    <Input type="number" name="price" required />
                  </FormGroup>
                )}
                <Button color="danger" type="submit">SELL</Button>
              </Form>
            </TabPane>
            <TabPane tabId="4"> 
              <BuyingScheduleForm />
            </TabPane>
            <TabPane tabId="5">
              <AlertForm type="stock" />
              <AlertList type="stock" />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* Option Positions Section */}
      <Card className="mt-4">
        <CardBody>
          <h5>{stockSymbol} - OPTION POSITIONS</h5>
          <Nav tabs>
            {["POSITIONS", "BUY", "SELL", "OPTIONS CHAIN", "SIMULATE", "ALERTS"].map((tab, index) => (
              <NavItem key={index}>
                <NavLink className={classnames({ active: optionTab === String(index + 1) })} onClick={() => setOptionTab(String(index + 1))}>
                  {tab}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={optionTab}>
            <TabPane tabId="1">
              <Table striped>
                <thead>
                  <tr>
                    <th>Expiry</th>
                    <th>Type</th>
                    <th>Lots</th>
                    <th>Strike Price</th>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                    <th>Last Traded Price</th>
                    <th>Delta</th>
                    <th>Theta</th>
                    <th>Unrealized PnL</th>
                    <th>Potential PnL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...optionData].sort((a, b) => (a.type === "PUT" ? -1 : 1)).map((option, index) => (
                    <tr key={index}>
                      <td>{option.expiry}</td>
                      <td>{option.type}</td>
                      <td>{option.lots}</td>
                      <td>{option.strikePrice}</td>
                      <td>{option.buyPrice}</td>
                      <td>{option.sellPrice}</td>
                      <td>{option.lastTradedPrice}</td>
                      <td>{option.delta}</td>
                      <td>{option.theta}</td>
                      <td>{option.unrealizedPnL}</td>
                      <td>{option.potentialPnL}</td>
                      <td>
                      <button
                        color="danger" //bg-red-500 text-white px-2 py-1 rounded
                        onClick={() => handleSquareOff(option)}
                      >
                        Square Off
                    </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>


            </TabPane>
            <TabPane tabId="2">
              <Form onSubmit={(e) => handleOrderSubmit(e, "BUY")}>
                <FormGroup>
                  <Label>Expiry</Label>
                  <Input type="date" name="expiry" value={buyFormData.expiry} onChange={(e) => setBuyFormData({ ...buyFormData, expiry: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <Label>Type</Label>
                  <Input type="select" name="type" value={buyFormData.type} onChange={(e) => setBuyFormData({ ...buyFormData, type: e.target.value })}>
                    <option>CALL</option>
                    <option>PUT</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Lots</Label>
                  <Input type="number" name="lots" value={buyFormData.lots} onChange={(e) => setBuyFormData({ ...buyFormData, lots: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <Label>Strike Price</Label>
                  <Input type="number" name="strikePrice" value={buyFormData.strikePrice} onChange={(e) => setBuyFormData({ ...buyFormData, strikePrice: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <Label>Buy Price</Label>
                  <Input type="number" name="buyPrice" value="0" required />
                </FormGroup>
                <Button color="success" type="submit">BUY</Button>
              </Form>
            </TabPane>
            <TabPane tabId="3">
              <Form onSubmit={(e) => handleOrderSubmit(e, "SELL")}>
                <FormGroup>
                  <Label>Expiry</Label>
                  <Input type="date" name="expiry" value={sellFormData.expiry} onChange={(e) => setSellFormData({...sellFormData, expiry: e.target.value})} required />
                </FormGroup>
                <FormGroup>
                  <Label>Type</Label>
                  <Input type="select" name="type" value={sellFormData.type} onChange={(e) => setSellFormData({ ...sellFormData, type: e.target.value })}>
                    <option>CALL</option>
                    <option>PUT</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Lots</Label>
                  <Input type="number" name="lots" value={sellFormData.lots} onChange={(e) => setSellFormData({...sellFormData, lots: e.target.value})} required />
                </FormGroup>
                <FormGroup>
                  <Label>Strike Price</Label>
                  <Input type="number" name="strikePrice" value={sellFormData.strikePrice} onChange={(e) => setSellFormData({...sellFormData, strikePrice: e.target.value})} required />
                </FormGroup>
                <FormGroup>
                  <Label>Sell Price</Label>
                  <Input type="number" name="sellPrice" value="0" required />
                </FormGroup>
                <Button color="danger" type="submit">SELL</Button>

              </Form>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardBody>
          <h5>{stockSymbol} - SUMMARY</h5>
          <Table striped className="mt-3">
                <thead>
                  <tr>
                    <th>Current Stock Price</th>
                    <th>Net Long Delta</th>
                    <th>Net Short Delta</th>
                    <th>Booked PnL</th>
                    <th>Net Unrealized PnL</th>
                    <th>Net Potential PnL</th>
                    <th>Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{stocklastTradedPrice[0]}</td>
                    <td>
                      {optionData
                        .filter((opt) => opt.type === "PE")
                        .reduce((acc, opt) => acc + opt.delta * opt.lots, 0)
                        .toFixed(2)}
                    </td>
                    <td>
                      {optionData
                        .filter((opt) => opt.type === "CE")
                        .reduce((acc, opt) => acc + opt.delta * opt.lots, 0)
                        .toFixed(2)}
                    </td>
                    <td>0</td> {/* Assuming no booked PnL data available */}
                    <td>
                      {optionData.reduce((acc, opt) => acc + opt.unrealizedPnL, 0)}
                    </td>
                    <td>
                      {optionData.reduce((acc, opt) => acc + opt.potentialPnL, 0)}
                    </td>
                    <td>
                      <select id="strategy" value={strategy} onChange={handleChange}>
                        <option value="Delta Pyramiding">Delta Pyramiding</option>
                        <option value="Delta Hedging">Delta Hedging</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </Table>
        </CardBody>
      </Card>

    </div>
  );
};

export default StockPage;
