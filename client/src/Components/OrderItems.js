import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
function OrderItems() {
  const [orderitems, setOrderItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [params] = useSearchParams();
  const orderid = params.get("orderno");

  const fetchOrderProducts = useCallback(async () => {
    if (!orderid) {
      setError("No order ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/getorderproducts?orderno=${orderid}`
      );

      if (resp.status === 200) {
        if (resp.data?.statuscode === 1) {
          setOrderItems(Array.isArray(resp.data.items) ? resp.data.items : []);
        } else {
          setOrderItems([]);
          setError(resp.data?.message || "No items found for this order");
        }
      } else {
        throw new Error("Failed to fetch order details");
      }
    } catch (err) {
      console.error("Error fetching order items:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
      setOrderItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderid]);

  useEffect(() => {
    fetchOrderProducts();
  }, [fetchOrderProducts]);

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Order Items</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">
                <Link to="/order-history" className="alert-link">
                  ← Back to Order History
                </Link>
              </p>
            </div>
          ) : Array.isArray(orderitems) && orderitems.length > 0 ? (
            <>
              <h2>Order #{orderid} - Products</h2>
              <p className="text-muted">
                Order placed on {new Date().toLocaleDateString()}
              </p>
              <br />
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Picture</th>
                      <th>Name</th>
                      <th>Rate</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderitems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.picture && (
                            <img
                              src={`${
                                process.env.REACT_APP_API_URL || ""
                              }/uploads/${item.picture}`}
                              alt={item.ProdName || "Product"}
                              className="img-thumbnail"
                              style={{ maxHeight: "75px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-product.png";
                              }}
                            />
                          )}
                        </td>
                        <td>{item.ProdName || "N/A"}</td>
                        <td>₹{parseFloat(item.Rate || 0).toFixed(2)}</td>
                        <td>{item.Qty || 0}</td>
                        <td>₹{parseFloat(item.TotalCost || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-3">
                <h5>
                  Order Total: ₹
                  {orderitems
                    .reduce(
                      (sum, item) => sum + parseFloat(item.TotalCost || 0),
                      0
                    )
                    .toFixed(2)}
                </h5>
              </div>
              <div className="mt-4">
                <Link to="/orderhistory" className="btn btn-secondary me-2">
                  ← Back to Orders
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-4">
                <i className="bi bi-box-seam"></i>
              </div>
              <h2>No items found in this order</h2>
              <p className="lead">
                We couldn't find any items for order #{orderid}
              </p>
              <div className="mt-4">
                <Link to="/orderhistory" className="btn btn-primary me-2">
                  View Order History
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
@media (max-width: 768px) {
  .login .container {
    padding: 15px;
  }

  .login h2 {
    font-size: 22px;
    text-align: center;
  }

  .login p.text-muted {
    font-size: 14px;
    text-align: center;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .table {
    font-size: 14px;
  }

  .table th,
  .table td {
    white-space: nowrap;
    text-align: center;
  }

  .img-thumbnail {
    max-width: 50px !important;
    max-height: 50px !important;
    margin: auto;
  }

  .text-end.mt-3 {
    text-align: center !important;
    margin-top: 20px;
  }

  .mt-4 {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .btn {
    width: 100%;
    font-size: 16px;
    padding: 10px;
  }

  .banner1 h3 {
    font-size: 18px;
    text-align: center;
  }

  .alert {
    font-size: 14px;
  }

  .display-1 {
    font-size: 3rem;
  }

  .lead {
    font-size: 16px;
    text-align: center;
  }
}
  `}
      </style>
    </>
  );
}
export default OrderItems;
