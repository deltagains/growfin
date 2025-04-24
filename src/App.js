import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AppMain from "./Layout/AppMain";

import { useAuth } from "./context/AuthContext"; // moved to top

import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import StockPage from "./pages/StockPage";
import Login from "./pages/Login";

export default function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>; // or your loading component

  return (
    <AppMain>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/stock/:stockSymbol" component={StockPage} />
        <Route exact path="/">
          <RedirectToDashboardOrLogin />
        </Route>
      </Switch>
    </AppMain>
  );
}

// Helper component to redirect based on login status
function RedirectToDashboardOrLogin() {
  const { user } = useAuth();
  return <Redirect to={user ? "/dashboard" : "/login"} />;
}
