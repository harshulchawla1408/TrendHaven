import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { FaShoppingCart, FaUsers, FaUserCog, FaClipboardList, FaCaretDown } from "react-icons/fa";
import { useCart } from "./CartContext";
import "./style.css";

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

function AdminHeader() {
  const { udata, setudata } = useContext(userContext);
  const navigate = useNavigate();
  const [sterm, setsterm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { itemCount, clearCart } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  function onlogout() {
    clearCart();
    setudata(null);
    sessionStorage.clear();
    navigate("/homepage");
  }
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
                    <span>Welcome Admin</span>
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
        <div className="clearfix"> </div>
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
                  <ul className="nav navbar-nav" style={{ display: 'flex', alignItems: 'center' }}>
                    <li>
                      <Link to="/managecategory">Categories</Link>
                    </li>
                    <li>
                      <Link to="/managesubcat">Sub Categories</Link>
                    </li>
                    <li>
                      <Link to="/manageproduct">Products</Link>
                    </li>
                    <li className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                      <Link 
                        to="#" 
                        className="dropdown-toggle" 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDropdown();
                        }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        Admin access <FaCaretDown style={{ marginLeft: '5px' }} />
                      </Link>
                      {isDropdownOpen && (
                        <ul className="dropdown-menu" style={{
                          display: 'block',
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          zIndex: 1000,
                          minWidth: '200px',
                          padding: '5px 0',
                          margin: '2px 0 0',
                          listStyle: 'none',
                          fontSize: '14px',
                          textAlign: 'left',
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 6px 12px rgba(0,0,0,.175)'
                        }}>
                          <li style={{ display: 'block' }}>
                            <Link to="/listofusers" style={{
                              display: 'block',
                              padding: '8px 20px',
                              clear: 'both',
                              fontWeight: 400,
                              lineHeight: 1.42857143,
                              color: '#333',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <FaUsers style={{ marginRight: '8px' }} /> List of Users
                            </Link>
                          </li>
                          <li style={{ display: 'block' }}>
                            <Link to="/searchuser" style={{
                              display: 'block',
                              padding: '8px 20px',
                              clear: 'both',
                              fontWeight: 400,
                              lineHeight: 1.42857143,
                              color: '#333',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <FaUserCog style={{ marginRight: '8px' }} /> Search User
                            </Link>
                          </li>
                          <li style={{ display: 'block' }}>
                            <Link to="/vieworders" style={{
                              display: 'block',
                              padding: '8px 20px',
                              clear: 'both',
                              fontWeight: 400,
                              lineHeight: 1.42857143,
                              color: '#333',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <FaClipboardList style={{ marginRight: '8px' }} /> View Orders
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li style={{ marginLeft: '10px' }}>
                      <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                      }}>
                        <Link
                          to="/showcart"
                          style={{
                            ...cartIconStyle,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: '#fff',
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          <FaShoppingCart />
                          {itemCount > 0 && (
                            <span style={cartCountStyle}>
                              {itemCount > 9 ? '9+' : itemCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
            <div className="header-right2">
              <input
                type="search"
                name="Search"
                placeholder="Search for a Product..."
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

            <div className="clearfix"> </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminHeader;
