import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

function ShowCart() {
  const [billamt, setBillAmt] = useState(0);
  const { udata } = useContext(userContext);
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.Rate * item.quantity;
    }, 0);
    setBillAmt(total);
  }, [cartItems]);

  const handleRemoveItem = (productId, productName) => {
    toast.info(
      <div>
        <p>Remove {productName || "this item"} from cart?</p>
        <div className="toast-buttons">
          <button
            onClick={() => {
              toast.dismiss();
              removeFromCart(productId);
              toast.success(`${productName || "Item"} removed from cart!`);
            }}
            className="toast-btn remove"
          >
            Remove
          </button>
          <button onClick={() => toast.dismiss()} className="toast-btn cancel">
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        style: { width: "300px" },
      }
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is emptier than my weekend plans", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    sessionStorage.setItem("tbill", billamt);
    navigate("/checkout");
  };

  return (
    <>
       <div className="banner1">
        <div className="container">
          <h3>
            <a href="index.html">Home</a> / <span>Your Cart</span>
          </h3>
        </div>
      </div>

<div className="show-cart-wrapper cart-section">
        <div className="container">
          {cartItems.length > 0 ? (
            <>
              <h2>Your Shopping Cart  ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</h2>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            item.picture
                              ? `uploads/${item.picture}`
                              : "/placeholder.jpg"
                          }
                          alt={item.pname}
                          className="product-img"
                        />
                      </td>
                      <td>{item.pname}</td>
                      <td>₹{Number(item.Rate).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.Rate * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn remove-btn"
                          onClick={() => handleRemoveItem(item._id, item.pname)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="summary-box">
                <h4>Grand Total: ₹{billamt.toFixed(2)}</h4><br/>
                <div className="action-buttons">
                  <button className="btn checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                  <button className="btn clear-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                alt="empty cart"
              />
              <h2>Your cart is empty</h2>
              <p>Start adding some cool stuff now!</p>
              <Link to="/" className="btn home-btn">
                Go to Home
              </Link>
            </div>
          )}
        </div>
      </div>

<style jsx="true">{`
  .show-cart-wrapper .banner {
    background: linear-gradient(to right, #007bff, #00c6ff);
    color: white;
    padding: 20px 0;
    text-align: center;
  }

  .show-cart-wrapper .container {
    padding: 30px;
  }

  .show-cart-wrapper .cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .show-cart-wrapper .cart-table th,
  .show-cart-wrapper .cart-table td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  .show-cart-wrapper .product-img {
    height: 75px;
    width: auto;
    border-radius: 8px;
  }

  .show-cart-wrapper .btn {
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }

  .show-cart-wrapper .remove-btn {
    background-color: #dc3545;
    color: white;
  }

  .show-cart-wrapper .checkout-btn {
    background-color: #28a745;
    color: white;
    margin-right: 10px;
  }

  .show-cart-wrapper .clear-btn {
    background-color: #6c757d;
    color: white;
  }

  .show-cart-wrapper .summary-box {
    margin-top: 30px;
    text-align: right;
  }

  .show-cart-wrapper .empty-cart {
    text-align: center;
    padding: 60px 0;
  }

  .show-cart-wrapper .empty-cart img {
    width: 120px;
    margin-bottom: 20px;
  }

  .show-cart-wrapper .home-btn {
    background-color: rgb(7, 116, 233);
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    margin-top: 20px;
    display: inline-block;
  }

  .show-cart-wrapper .toast-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }

  .show-cart-wrapper .toast-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .show-cart-wrapper .toast-btn.remove {
    background-color: #dc3545;
    color: white;
  }

  .show-cart-wrapper .toast-btn.cancel {
    background-color: #6c757d;
    color: white;
  }

  @media (max-width: 768px) {
    .show-cart-wrapper .container {
      padding: 15px;
    }

    .show-cart-wrapper h2 {
      font-size: 20px;
      text-align: center;
    }

    .show-cart-wrapper .cart-table {
      display: block;
      width: 100%;
      overflow-x: auto;
      font-size: 14px;
    }

    .show-cart-wrapper .cart-table thead {
      white-space: nowrap;
    }

    .show-cart-wrapper .product-img {
      max-width: 60px;
      height: auto;
      margin: auto;
    }

    .show-cart-wrapper .summary-box {
      text-align: center;
      margin-top: 20px;
    }

    .show-cart-wrapper .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 15px;
    }

    .show-cart-wrapper .btn {
      width: 100%;
      max-width: 300px;
      font-size: 15px;
    }

    .show-cart-wrapper .cart-table th,
    .show-cart-wrapper .cart-table td {
      padding: 8px;
    }

    .show-cart-wrapper .empty-cart h2 {
      font-size: 20px;
    }

    .show-cart-wrapper .home-btn {
      width: 100%;
      max-width: 300px;
      font-size: 15px;
    }
  }
`}</style>


    </>
  );
}

export default ShowCart;
