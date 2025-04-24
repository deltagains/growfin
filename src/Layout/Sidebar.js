import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MetisMenu from "react-metismenu";
import { setEnableMobileMenu } from "../reducers/ThemeOptions";
import './sidebar.css';
import {
  UpgradeNav,
  MainNav,
  ComponentsNav,
  FormsNav,
  WidgetsNav,
  ChartsNav,
} from "./NavItems";

class Nav extends Component { 
  state = {
    stockPortfolioNav: [],
  };

  async componentDidMount() {
    //const response = await fetch("http://82.208.20.218:5000/get_all_positions");
    const response = await fetch("https://deltagainsprod.pythonanywhere.com/get_all_positions");
    const data = await response.json();
  
    console.log("Fetched Stock Data:", data);
  
    if (Array.isArray(data)) {
      const stockPortfolioNav = [
        {
          icon: "pe-7s-portfolio",
          label: "Stock Portfolio",
          content: data.map((symbol) => ({
            label: symbol,
            to: `/stock/${symbol}`,
          })),
        },
      ];
  
      this.setState({ stockPortfolioNav });
    } else {
      console.error("Unexpected data format:", data);
    }
  }
  




  toggleMobileSidebar = () => {
    const { enableMobileMenu, setEnableMobileMenu } = this.props;
    setEnableMobileMenu(!enableMobileMenu);
  };

  render() {
    return (
      <div className="sidebar">
      <Fragment>
        <div className="app-sidebar__inner">
          <h5 className="app-sidebar__heading">Menu</h5>
          <MetisMenu
            content={MainNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />
  
          {this.state.stockPortfolioNav.length > 0 ? (
            <>
              <h5 className="app-sidebar__heading">Stock Portfolio</h5>
              <MetisMenu
                content={this.state.stockPortfolioNav}
                onSelected={this.toggleMobileSidebar}
                activeLinkFromLocation
                className="vertical-nav-menu"
                iconNamePrefix=""
                classNameStateIcon="pe-7s-angle-down"
              />
            </>
          ) : (
            <h5 className="app-sidebar__heading">Loading Stocks...</h5>
          )}
  
          <h5 className="app-sidebar__heading">Dashboard Widgets</h5>
          <MetisMenu
            content={WidgetsNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />
  
          <h5 className="app-sidebar__heading">Forms</h5>
          <MetisMenu
            content={FormsNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />
  
          <h5 className="app-sidebar__heading">Charts</h5>
          <MetisMenu
            content={ChartsNav}
            onSelected={this.toggleMobileSidebar}
            activeLinkFromLocation
            className="vertical-nav-menu"
            iconNamePrefix=""
            classNameStateIcon="pe-7s-angle-down"
          />
        </div>
      </Fragment>
      </div>
    );
  }
  
}

const mapStateToProps = (state) => ({
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
});

const mapDispatchToProps = (dispatch) => ({
  setEnableMobileMenu: (enable) => dispatch(setEnableMobileMenu(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
