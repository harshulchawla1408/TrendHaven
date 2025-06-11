import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";

function OrderHistory() {
  const [ordersdata, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { udata } = useContext(userContext);

  const fetchOrders = async () => {
    if (!udata?.username) return;

    try {
      setLoading(true);
      setError(null);
      const resp = await axios.get(`http://localhost:9000/api/getuserorders?un=${udata.username}`);

      if (resp.data.statuscode === 1) {
        const sortedOrders = resp.data.ordersdata.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
        setOrdersData(sortedOrders);
      } else {
        setOrdersData([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setOrdersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (udata?.username) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please login to view your orders");
      navigate("/login", { state: { from: "/orderhistory" } });
    }
  }, [udata, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Placed: "primary",
      Shipped: "info",
      Delivered: "success",
      Cancelled: "danger",
      Returned: "warning",
    };
    const color = statusMap[status] || "secondary";
    return <span className={`badge bg-${color}`}>{status}</span>;
  };

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Order History</span>
          </h3>
        </div>
      </div>

      <div className="container my-5">
        <h2 className="mb-4 text-center fw-bold">Your Orders</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            <h5>Oops! Something went wrong</h5>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-outline-primary btn-sm">Retry</button>
          </div>
        ) : ordersdata.length > 0 ? (
          <div className="card shadow">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersdata.map(order => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/orderitems?orderno=${order._id}`} className="text-decoration-none fw-semibold text-primary">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td>{formatDate(order.OrderDate)}</td>
                      <td>{order.OrderProducts?.length || 0} item(s)</td>
                      <td>₹{order.billamt?.toFixed(2)}</td>
                      <td>{getStatusBadge(order.status || "Placed")}</td>
                      <td>
                        <Link to={`/orderitems?orderno=${order._id}`} className="btn btn-sm btn-outline-secondary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer text-end bg-white">
              <small className="text-muted">
                Showing <b>{ordersdata.length}</b> {ordersdata.length === 1 ? "order" : "orders"}
              </small>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <FaBoxOpen size={48} className="text-muted mb-3" />
            <h4>No Orders Found</h4>
            <p className="text-muted">You haven't placed any orders yet.</p>
            <Link to="/categories" className="btn btn-primary">
              <FaShoppingCart className="me-2" /> Start Shopping
            </Link>
          </div>
        )}
      </div>
 
      {/* Additional styles for mobile */}
      <style jsx="true">{`
        @media (max-width: 576px) {
          table thead {
            display: none;
          }
          table tbody tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            padding: 0.75rem;
          }
          table tbody td {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border: none;
          }
        }
      `}</style>
    </>
  );
}
export default OrderHistory;
