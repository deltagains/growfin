import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, Table, Button, Form, FormGroup, Label, Input } from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { stock_name } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.post("https://deltagainsprod.pythonanywhere.com/get_all_trades", {
          withCredentials: true,
        });
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
  }, [stock_name]);

  return (
    <div>
      <h5>DASHBOARD</h5>

      <div>
      Welcome {user?.pythonanywhere_username}
    </div>

      <LogoutButton />
    <Card>
        
      <CardBody>
 
            <Table striped>
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Stock Price</th>
                  <th>Stock Quantity</th>
                  <th>Put Quantity</th>
                  <th>Call Quantity</th>
                  <th>Long Delta</th>
                  <th>Short Delta</th>
                  <th>Current PnL</th>
                  <th>Total Potential Profit</th>
                  <th>Alerts</th>
                  <th>Booked Profit</th>
                  <th>Strategy</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.stock_name}</td>
                    <td>{stock.stock_price}</td>
                    <td>{stock.stock_quantity}</td>
                    <td>{stock.put_quantity}</td>
                    <td>{stock.call_quantity}</td>
                    <td>{stock.long_delta}</td>
                    <td>{stock.short_delta}</td>
                    <td>{stock.current_pnl}</td>
                    <td>{stock.total_potential_profit}</td>
                    <td>{stock.alerts}</td>
                    <td>{stock.booked_profit}</td>
                    <td>{stock.strategy}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
  
      </CardBody>
    </Card>
    </div>
  );
};

export default Dashboard;
