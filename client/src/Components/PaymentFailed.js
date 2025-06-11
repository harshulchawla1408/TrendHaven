import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, orderId } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      // If user directly navigates here without state, redirect to home
      navigate("/");
      return;
    }

    // Show error toast if available
    if (error) {
      toast.error(error);
    }
  }, [location.state, navigate, error]);

  const handleRetryPayment = () => {
    // Navigate back to checkout page
    navigate("/checkout");
  };

  if (!location.state) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Payment Failed</span>
          </h3>
        </div>
      </div>
      <div className="container my-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="mb-4">
                  <FaTimesCircle size={80} className="text-danger mb-3" />
                  <h2 className="text-danger">Payment Failed</h2>
                </div>

                <div className="mb-4">
                  <p className="lead">
                    We're sorry, but there was an issue processing your payment.
                  </p>

                  {error && (
                    <div className="alert alert-danger">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {orderId && (
                    <p className="text-muted small mt-2">Order ID: {orderId}</p>
                  )}
                </div>

                <div className="d-grid gap-3">
                  <button
                    onClick={handleRetryPayment}
                    className="btn btn-primary btn-lg"
                  >
                    Retry Payment
                  </button>

                  <Link
                    to="/orderhistory"
                    className="btn btn-outline-secondary"
                  >
                    View Order History
                  </Link>

                  <Link to="/categories" className="btn btn-link">
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-4 text-muted small">
                  <p>
                    If the problem persists, please contact our support team
                    with your order details.
                  </p>
                  <p className="mb-0">
                    Email: support@trendhaven.com
                    <br />
                    Phone: +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentFailed;
