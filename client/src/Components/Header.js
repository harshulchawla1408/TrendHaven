import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";

// Add CSS for cart icon and counter
const cartIconStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "20px",
  textDecoration: "none",
  marginLeft: "15px",
  padding: "8px",
  borderRadius: "50%",
  transition: "all 0.3s ease",
  width: "40px",
  height: "40px",
};

const cartCountStyle = {
  position: "absolute",
  top: "0",
  right: "0",
  backgroundColor: "#ff4444",
  color: "white",
  borderRadius: "50%",
  minWidth: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  padding: "0 4px",
  boxSizing: "border-box",
};

function Header() {
  const { udata, setudata } = useContext(userContext);
  const navigate = useNavigate();
  const [sterm, setsterm] = useState();
  const { clearCart } = useCart();

  function onlogout() {
    clearCart();
    setudata(null);
    sessionStorage.clear();
    navigate("/homepage");
  }
  const { itemCount } = useCart();

  function gotocart() {
    navigate("/showcart");
  }
  function onsearch() {
    navigate("/searchresults?s=" + sterm);
  }
  return (
    <>
      <div className="header">
        <div className="header-top">
          <div className="container">
            <div className="top-left">
              {udata === null ? (
                <h4 className="welcome-guest">
                  <b>
                    <span>Welcome Guest</span>
                  </b>
                </h4>
              ) : (
                <h4 className="welcome-user">
                  <b>
                    <span>Welcome {udata.pname}</span>
                  </b>
                </h4>
              )}
            </div>
            <div className="top-right">
              {udata === null ? (
                <ul>
                  <li>
                    <Link to="/register">Create Account </Link>{" "}
                  </li>
                  <li>
                    <Link to="/login">Login </Link>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link to="/orderhistory">Your Orders </Link>{" "}
                  </li>
                  <li>
                    <Link to="/changepassword">Change Password </Link>{" "}
                  </li>
                  <li>
                    <button className="btn btn-primary" onClick={onlogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
        <div className="heder-bottom">
          <div className="container">
            <div className="logo-nav">
              <div className="logo-nav-left">
                <h1>
                  <Link to="/homepage">
                    Trend Haven <span>Elevate Your Style</span>
                  </Link>
                </h1>
              </div>
              <div className="logo-nav-left1">
                <nav className="navbar navbar-default">
                  <div className="navbar-header nav_2">
                    <button
                      type="button"
                      className="navbar-toggle collapsed navbar-toggle1"
                      data-toggle="collapse"
                      data-target="#bs-megadropdown-tabs"
                    >
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                  </div>
                  <div
                    className="collapse navbar-collapse"
                    id="bs-megadropdown-tabs"
                  >
                    <ul className="nav navbar-nav">
                      <li>
                        <Link to="/homepage">Home</Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35f90545c8023f6b49087">
                          Men
                        </Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35fa6545c8023f6b4908b">
                          Women
                        </Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35fba545c8023f6b4908e">
                          Kids
                        </Link>
                      </li>
                      <li>
                        <Link to="/contactus">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="header-right2">
                <input
                  type="search"
                  name="Search"
                  placeholder="Search for a Product"
                  onChange={(e) => setsterm(e.target.value)}
                  required=""
                />
                <button
                  type="submit"
                  className="btn btn-default search"
                  onClick={onsearch}
                >
                  <i className="fa fa-search" aria-hidden="true">
                    {" "}
                  </i>
                </button>
                <div className="clearfix"></div>
              </div>
              <div className="header-right2" style={{ marginLeft: "10px" }}>
                <div
                  className="cart"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Link
                    to="/showcart"
                    style={cartIconStyle}
                    className="cart-icon"
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <FaShoppingCart />
                    {itemCount > 0 && (
                      <span style={cartCountStyle}>
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
              <div class="clearfix"> </div>
              <div className="clearfix"> </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
    @media (max-width: 767px) {
      .header-top .container,
      .heder-bottom .container {
        flex-direction: column;
        align-items: flex-start;
        display: flex;
      }

      .top-left,
      .top-right,
      .logo-nav-left,
      .logo-nav-left1,
      .header-right2 {
        width: 100%;
        margin-bottom: 10px;
      }

      .logo-nav-left h1 {
        font-size: 20px;
        line-height: 1.2;
      }

      .navbar-nav {
        flex-direction: column;
        width: 100%;
        padding-left: 0;
      }

      .navbar-nav li {
        width: 100%;
        text-align: left;
        padding: 5px 0;
      }

      .header-right2 {
        display: flex;
        width: 100%;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .header-right2 input[type="search"] {
        flex: 1;
        min-width: 60%;
        padding: 8px;
      }

      .header-right2 .search {
        padding: 8px 12px;
        font-size: 14px;
      }

      .cart-icon {
        margin-left: auto;
      }

      .cart {
        justify-content: flex-end;
        width: 100%;
      }

      .top-right ul,
      .top-right li {
        display: block;
        text-align: left;
        width: 100%;
      }

      .btn.btn-primary {
        width: 100%;
        padding: 6px;
      }
    }
  `}
      </style>
    </>
  );
}
export default Header;
