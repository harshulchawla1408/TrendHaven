import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./style.css";

function OrderSummary() {
  const { udata } = useContext(userContext);
  const [orderinfo, setOrderInfo] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    orderId: stateOrderId,
    saddr: stateShippingAddress,
    paymentMethod: statePaymentMethod,
  } = location.state || {};

  const orderIdFromUrl = new URLSearchParams(location.search).get("orderId");
  const orderId =
    stateOrderId || orderIdFromUrl || sessionStorage.getItem("lastOrderId");

  useEffect(() => {
    if (stateShippingAddress) setShippingAddress(stateShippingAddress);
    if (statePaymentMethod) setPaymentMethod(statePaymentMethod);
  }, [stateShippingAddress, statePaymentMethod]);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      toast.error("Order ID is missing");
      navigate("/orderhistory");
      return;
    }
    try {
      setLoading(true);
      const orderRes = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/getorderbyid?orderid=${orderId}`
      );
      if (orderRes.data.statuscode === 1 && orderRes.data.order) {
        const orderData = orderRes.data.order;
        setOrderInfo(orderData);
        if (orderData.saddr && !shippingAddress)
          setShippingAddress(orderData.saddr);
        if (orderData.PayMode && !paymentMethod)
          setPaymentMethod(orderData.PayMode);

        const itemsRes = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/getorderproducts?orderno=${orderId}`
        );
        if (itemsRes.data.statuscode === 1) {
          setOrderItems(
            Array.isArray(itemsRes.data.items) ? itemsRes.data.items : []
          );
        }
        return;
      }
    } catch (error) {
      console.error("First fetch failed", error);
    } finally {
      setLoading(false); // <<=== THIS IS IMPORTANT
    }

    try {
      const ordersRes = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/getuserorders?un=${udata.username}`
      );
      if (ordersRes.data.statuscode === 1) {
        const order = Array.isArray(ordersRes.data.ordersdata)
          ? ordersRes.data.ordersdata.find((o) => o._id === orderId)
          : null;
        if (order) {
          setOrderInfo(order);
          if (order.saddr && !shippingAddress) setShippingAddress(order.saddr);
          if (order.PayMode && !paymentMethod) setPaymentMethod(order.PayMode);
          const itemsRes = await axios.get(
            `${process.env.REACT_APP_BACKEND}/api/getorderproducts?orderno=${orderId}`
          );
          if (itemsRes.data.statuscode === 1) {
            setOrderItems(
              Array.isArray(itemsRes.data.items) ? itemsRes.data.items : []
            );
          }
        } else {
          toast.error("Order not found or access denied.");
          navigate("/orderhistory");
        }
      } else {
        toast.error("Failed to load order details.");
        navigate("/orderhistory");
      }
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/orderhistory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!udata) {
      toast.error("Please login to view your order summary.");
      navigate("/login");
      return;
    }
    if (!orderId) {
      toast.error("No order found. Please place an order first.");
      navigate("/");
      return;
    }
    fetchOrderDetails();
  }, [udata, navigate, orderId]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your order details...</p>
      </div>
    );
  }

  if (!orderinfo) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning">
          <h4>No order found</h4>
          <p>We couldn't find any order details.</p>
          <div className="mt-3">
            <Link to="/categories" className="btn btn-primary me-2">
              Continue Shopping
            </Link>
            <Link to="/orderhistory" className="btn btn-outline-secondary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Order Summary</span>
          </h3>
        </div>
      </div>

      <div className="order-summary container">
        <div className="order-summary-header text-center my-5">
          <h1>Thank you, {udata.pname}!</h1>
          <p>Your order has been placed successfully.</p>
        </div>

        <div className="order-details card p-4 shadow-sm mb-4">
          <h3 className="mb-4">Order #{orderinfo._id}</h3>
          <div className="row g-3">
            <div className="col-md-6 col-12">
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(orderinfo.OrderDate).toLocaleString()}
              </p>
              <p>
                <strong>Payment Mode:</strong> {orderinfo.PayMode || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge bg-success">Paid</span>
              </p>
            </div>
            <div className="col-md-6 col-12">
              <p>
                <strong>Total Amount:</strong> ₹{orderinfo.billamt?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div className="order-items card p-4 shadow-sm mb-4">
            <h4 className="mb-4">Order Items</h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.picture && (
                            <img
                              src={`/uploads/${item.picture}`}
                              alt={item.ProdName}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "15px",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/noimage.jpg";
                              }}
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{item.ProdName}</h6>
                            <small className="text-muted">
                              SKU: {item._id?.substring(0, 8)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.Rate?.toFixed(2)}</td>
                      <td>{item.Qty}</td>
                      <td>₹{(item.Rate * item.Qty)?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-end mt-3">
              <h5>Order Total: ₹{orderinfo.billamt?.toFixed(2)}</h5>
            </div>
          </div>
        )}

        <div className="order-actions text-center mt-5">
          <Link to="/categories" className="button mx-2">
            Continue Shopping
          </Link>
          <Link to="/orderhistory" className="button mx-2">
            View My Orders
          </Link>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
