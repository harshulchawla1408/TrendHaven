import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { useCart } from "./CartContext";
import "./style.css";

// Constants
const PAYMENT_METHODS = {
  COD: "cod",
  RAZORPAY: "razorpay",
};

const PAYMENT_LABELS = {
  [PAYMENT_METHODS.COD]: "Cash on Delivery",
  [PAYMENT_METHODS.RAZORPAY]: "Online Payment",
};

function CheckoutPage() {
  const [totalBill, setTotalBill] = useState(0);
  const navigate = useNavigate();
  const { udata } = useContext(userContext);
  const { clearCart, cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.RAZORPAY);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const tbill = parseFloat(sessionStorage.getItem("tbill"));
    if (!tbill || tbill <= 0) {
      toast.error("Invalid bill amount. Redirecting to cart...");
      navigate("/showcart");
    } else {
      setTotalBill(tbill);
    }
  }, [navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculateCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const rate = parseFloat(item.Rate || item.rate || 0);
      const qty = parseInt(item.Qty || item.quantity || 0, 10);
      return sum + rate * qty;
    }, 0);
  }, [cartItems]);

  const formatCartItems = useCallback(() => {
    return cartItems.map((item) => {
      const rate = parseFloat(item.Rate || item.rate || 0);
      const qty = parseInt(item.Qty || item.quantity || 0, 10);
      return {
        pid: item.pid || item._id,
        pname: item.ProdName || item.pname,
        Rate: rate,
        rate: rate,
        Qty: qty,
        quantity: qty,
        picture: item.picture || "noimage.jpg",
        total: rate * qty,
        originalPrice: item.originalPrice || item.price || rate,
      };
    });
  }, [cartItems]);

  const placeOrder = useCallback(
    async (paymentDetails) => {
      if (!shippingAddress.trim()) {
        toast.error("Please enter a shipping address");
        return;
      }

      setLoading(true);
      try {
        const calculatedTotal = calculateCartTotal();
        const isCod = paymentMethod === PAYMENT_METHODS.COD;

        const orderData = {
          saddr: shippingAddress,
          tbill: calculatedTotal,
          uname: udata.username,
          pmode: isCod ? PAYMENT_LABELS[PAYMENT_METHODS.COD] : "Online",
          status: isCod ? "Placed" : "Pending",
          cardDetails: paymentDetails,
          cartinfo: formatCartItems(),
        };

        const orderRes = await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/saveorder`,
          orderData
        );

        if (orderRes.data?.statuscode === 1) {
          clearCart();
          localStorage.removeItem("cart");
          const orderId = orderRes.data.orderid || orderRes.data.orderId;
          sessionStorage.setItem("lastOrderId", orderId);

          const orderDetails = {
            orderId,
            fromPayment: true,
            saddr: shippingAddress,
            paymentMethod: isCod
              ? PAYMENT_LABELS[PAYMENT_METHODS.COD]
              : PAYMENT_LABELS[PAYMENT_METHODS.RAZORPAY],
            items: cartItems,
            total: calculatedTotal,
          };

          toast.success(`Order ${isCod ? "placed" : "paid"} successfully!`);
          navigate("/ordersummary", { state: orderDetails });
        } else {
          throw new Error(orderRes.data?.message || "Failed to save order");
        }
      } catch (error) {
        console.error("Order placement error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error processing order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      shippingAddress,
      paymentMethod,
      udata.username,
      calculateCartTotal,
      formatCartItems,
      clearCart,
      navigate,
      cartItems,
    ]
  );

  const handlePayment = async () => {
    if (!udata?.username) {
      toast.error("Please login to proceed with payment.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/showcart");
      return;
    }

    const calculatedTotal = calculateCartTotal();
    if (calculatedTotal <= 0) {
      toast.error("Invalid order amount. Please add items to your cart.");
      return;
    }

    if (paymentMethod === PAYMENT_METHODS.COD) {
      await placeOrder({
        paymentId: `COD_${Date.now()}`,
        orderId: `ORDER_${Date.now()}`,
        status: "pending",
      });
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    setLoading(true);

    try {
      const { data: razorpayOrder } = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/payment/order`,
        {
          amount: totalBill,
          amountInRupees: true,
          currency: "INR",
          receipt: `order_rcpt_${Date.now()}`,
        }
      );

      if (!razorpayOrder.success || !razorpayOrder.id) {
        throw new Error(
          razorpayOrder.error || "Failed to create Razorpay order"
        );
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Trend Haven",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${process.env.REACT_APP_BACKEND}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data && verifyRes.data.success) {
              const calculatedTotal = cartItems.reduce((sum, item) => {
                const rate = parseFloat(item.Rate || item.rate || 0);
                const qty = parseInt(item.Qty || item.quantity || 0, 10);
                return sum + rate * qty;
              }, 0);

              const orderData = {
                saddr: shippingAddress, 
                tbill: calculatedTotal,
                uname: udata.username,
                pmode: "Online",
                status: "Placed",
                cardDetails: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  status: "captured",
                },
                cartinfo: cartItems.map((item) => {
                  const rate = parseFloat(item.Rate || item.rate || 0);
                  const qty = parseInt(item.Qty || item.quantity || 0, 10);
                  return {
                    pid: item.pid || item._id,
                    pname: item.ProdName || item.pname,
                    Rate: rate,
                    rate: rate,
                    Qty: qty,
                    quantity: qty,
                    picture: item.picture || "noimage.jpg",
                    total: rate * qty,
                    originalPrice: item.originalPrice || item.price || rate,
                  };
                }),
              };


              const orderRes = await axios.post(
                `${process.env.REACT_APP_BACKEND}/api/saveorder`,
                orderData
              );

              if (orderRes.data && orderRes.data.statuscode === 1) {
                clearCart();
                localStorage.removeItem("cart");

                const orderId = orderRes.data.orderid || orderRes.data.orderId;
                sessionStorage.setItem("lastOrderId", orderId);

                toast.success("Order placed successfully!");
                navigate("/ordersummary", {
                  state: { orderId: orderId, fromPayment: true },
                });
                return;
              } else {
                throw new Error(
                  orderRes.data?.message || "Failed to save order"
                );
              }
            } else {
              throw new Error(
                verifyRes.data.message || "Payment verification failed"
              );
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Error during payment"
            );
            navigate("/paymentfailed", {
              state: {
                error: error.message,
                orderId: razorpayOrder?.id,
                originalError: error.message,
              },
              replace: true,
            });
          }
        },
        prefill: {
          name: /^[a-zA-Z ]{3,50}$/.test(udata?.username)
            ? udata.username
            : "Harshul Chawla",
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(udata?.email)
            ? udata.email
            : "harshulchawla1408@gmail.com",
          contact: /^[6-9]\d{9}$/.test(udata?.phone)
            ? udata.phone
            : "7814272742",
        },

        theme: {
          color: "#528FF0",
        },
        modal: {
          ondismiss: function () {
            if (loading) {
              toast.info("Payment process was cancelled");
              setLoading(false);
            }
          },
        },
      };

      let rzp;
      let paymentTimeout;

      try {
        rzp = new window.Razorpay(options);
        rzp.open();

        paymentTimeout = setTimeout(() => {
          if (document.querySelector(".razorpay-container")) {
            rzp.close();
            toast.error("Payment timed out. Please try again.");
            setLoading(false);
          }
        }, 10 * 60 * 1000);
      } catch (error) {
        toast.error(
          "Failed to initialize payment gateway. Please try again later."
        );
        setLoading(false);
      }

      return () => {
        if (paymentTimeout) clearTimeout(paymentTimeout);
      };
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          "Failed to process your order."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Checkout</span>
          </h3>
        </div>
      </div>
      <div
        className="checkout-page"
        style={{
          background: "#f9fafb",
          minHeight: "100vh",
          padding: "40px 0",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "960px",
            margin: "auto",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "40px 40px 60px 40px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#222",
              marginBottom: "35px",
              borderBottom: "2px solid #528FF0",
              paddingBottom: "10px",
            }}
          >
            Checkout
          </h1>

          <div
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/* Left: Cart & Shipping */}
            <section
              style={{
                flex: "1 1 580px",
                border: "1px solid #e1e5eb",
                borderRadius: "8px",
                padding: "30px",
                backgroundColor: "#fdfdfd",
                boxShadow: "inset 0 0 10px #f1f3f5",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "20px",
                  fontWeight: "600",
                  color: "#333",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "12px",
                }}
              >
                Order Items
              </h2>

              <div
                style={{
                  maxHeight: "320px",
                  overflowY: "auto",
                  marginBottom: "25px",
                  paddingRight: "8px",
                }}
              >
                {cartItems.length === 0 ? (
                  <p style={{ color: "#888", fontStyle: "italic" }}>
                    Your cart is empty.
                  </p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "18px",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "15px",
                      }}
                    >
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
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "17px",
                            fontWeight: "600",
                            color: "#222",
                          }}
                        >
                          {item.ProdName || item.pname}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            color: "#555",
                            fontWeight: "500",
                          }}
                        >
                          Qty: {item.Qty || item.quantity} &nbsp;|&nbsp; Price:
                          ₹
                          {(
                            parseFloat(item.Rate || item.rate) *
                            (item.Qty || item.quantity)
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid #ddd",
                  paddingTop: "20px",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#111",
                  display: "flex",
                  justifyContent: "space-between",
                  letterSpacing: "0.02em",
                }}
              >
                <span>Total</span>
                <span>₹{totalBill.toFixed(2)}</span>
              </div>

              {/* Shipping Details */}
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "20px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  Shipping Details
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#555",
                    lineHeight: "1.5",
                  }}
                >
                  We deliver all orders within 3-5 business days. Free shipping
                  on orders above ₹999.
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#555",
                    lineHeight: "1.5",
                  }}
                >
                  For more information, visit our{" "}
                  <Link
                    to="/shipping-policy"
                    style={{ color: "#528FF0", textDecoration: "underline" }}
                  >
                    Shipping Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Cancellation Policy */}
              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  Cancellation Policy
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#555",
                    lineHeight: "1.5",
                  }}
                >
                  You can cancel your order within 24 hours of placing it. For
                  more details, see our{" "}
                  <Link
                    to="/cancellation-policy"
                    style={{ color: "#528FF0", textDecoration: "underline" }}
                  >
                    Cancellation Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Right: Payment */}
            <section
              style={{
                flex: "1 1 320px",
                border: "1px solid #e1e5eb",
                borderRadius: "8px",
                padding: "30px",
                backgroundColor: "#fafbfc",
                boxShadow: "inset 0 0 15px #f0f2f5",
                height: "fit-content",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "25px",
                  fontWeight: "600",
                  color: "#333",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "12px",
                }}
              >
                Shipping & Payment
              </h2>

              {/* Shipping Address */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    marginBottom: "12px",
                    color: "#333",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ marginRight: "8px", color: "#4CAF50" }}
                  ></i>
                  Shipping Address
                </h3>
                <div
                  style={{
                    position: "relative",
                    marginBottom: "20px",
                  }}
                >
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your complete shipping address"
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "15px",
                      resize: "vertical",
                      minHeight: "100px",
                      fontFamily: "inherit",
                    }}
                    required
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="fas fa-info-circle"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Please include house number, street, city, state, and PIN
                    code
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    marginBottom: "15px",
                    color: "#333",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fas fa-credit-card"
                    style={{ color: "#666" }}
                  ></i>
                  Select Payment Method
                </h3>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px",
                    border: `2px solid ${
                      paymentMethod === "cod" ? "#4CAF50" : "#e0e0e0"
                    }`,
                    borderRadius: "8px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    backgroundColor:
                      paymentMethod === "cod" ? "#f0f9f0" : "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => {}}
                    style={{
                      marginRight: "15px",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#4CAF50",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <i
                        className="fas fa-money-bill-wave"
                        style={{
                          color: "#4CAF50",
                          fontSize: "20px",
                          marginRight: "10px",
                        }}
                      ></i>
                      <span style={{ fontWeight: "600", fontSize: "16px" }}>
                        Cash on Delivery
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "5px 0 0 33px",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      Pay in cash upon delivery
                    </p>
                  </div>
                </div>

                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px",
                    border: `2px solid ${
                      paymentMethod === "razorpay" ? "#528FF0" : "#e0e0e0"
                    }`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor:
                      paymentMethod === "razorpay" ? "#f0f6ff" : "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => {}}
                    style={{
                      marginRight: "15px",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#528FF0",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <i
                        className="fas fa-credit-card"
                        style={{
                          color: "#528FF0",
                          fontSize: "20px",
                          marginRight: "10px",
                        }}
                      ></i>
                      <span style={{ fontWeight: "600", fontSize: "16px" }}>
                        Pay with Razorpay
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "5px 0 0 33px",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      Secure online payment with cards, UPI, and wallets
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor:
                    paymentMethod === "cod" ? "#4CAF50" : "#528FF0",
                  color: "#fff",
                  padding: "16px",
                  fontSize: "18px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: loading
                    ? "none"
                    : paymentMethod === "cod"
                    ? "0 4px 10px rgba(76, 175, 80, 0.5)"
                    : "0 4px 10px rgba(82,143,240,0.5)",
                  transition: "all 0.3s ease",
                  marginTop: "10px",
                }}
                className={loading ? "loading" : ""}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner"
                      aria-hidden="true"
                      style={{
                        border: "3px solid #f3f3f3",
                        borderTop: "3px solid #fff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        animation: "spin 1s linear infinite",
                      }}
                    ></span>
                    {paymentMethod === "cod"
                      ? "Placing Order..."
                      : "Processing..."}
                  </>
                ) : (
                  <>
                    {paymentMethod === "cod" ? (
                      <>
                        <i className="fas fa-shopping-bag"></i>
                        Place Order (Cash on Delivery)
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card"></i>
                        Pay with Razorpay
                      </>
                    )}
                  </>
                )}
              </button>

              <div
                style={{
                  marginTop: "30px",
                  fontSize: "16px",
                  color: "#6c757d",
                  textAlign: "center",
                  paddingTop: "20px",
                  borderTop: "1px solid #eaeaea",
                }}
              >
                <div style={{ marginBottom: "15px", fontWeight: "500" }}>
                  <i
                    className="fas fa-lock"
                    style={{ marginRight: "8px", color: "#28a745" }}
                  ></i>
                  Secure Payment
                </div>
                <div
                  style={{
                    marginBottom: "15px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  We accept all major payment methods including credit/debit
                  cards, UPI, and wallets
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fab fa-cc-visa"
                      style={{ color: "#1A1F71", fontSize: "24px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Visa
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fab fa-cc-mastercard"
                      style={{ color: "#EB001B", fontSize: "24px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Mastercard
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fab fa-cc-amex"
                      style={{ color: "#006FCF", fontSize: "24px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Amex
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fab fa-cc-discover"
                      style={{ color: "#FF6600", fontSize: "24px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Discover
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fas fa-rupee-sign"
                      style={{ color: "#4CAF50", fontSize: "20px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>UPI</span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fas fa-wallet"
                      style={{ color: "#5C6BC0", fontSize: "20px" }}
                    ></i>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Wallets
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "15px",
                    fontSize: "14px",
                    color: "#999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-lock" style={{ color: "#4CAF50" }}></i>
                  <span>Secure & Encrypted Payment</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Spinner animation */}
        <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .loading {
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
      </div>
    </>
  );
}

export default CheckoutPage;
