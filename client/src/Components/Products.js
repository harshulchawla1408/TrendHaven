import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { useCart } from "./CartContext";

function Products() {
  const [params] = useSearchParams();
  const subcatid = params.get("sid");
  const [prodsdata, setprodsdata] = useState([]);
  const navigate = useNavigate();
  const { udata } = useContext(userContext);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    if (!udata) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }

    const productToAdd = {
      _id: product._id,
      picture: product.picture || "",
      pname: product.pname || "Product",
      Rate: product.Rate - (product.Rate * (product.Discount || 0)) / 100,
      quantity: 1,
      Stock: product.Stock || 0,
    };

    addToCart(productToAdd);
    toast.success("Product added to cart!");
  };

  useEffect(() => {
    if (subcatid !== "") {
      fetchprodsbysubcat();
    }
  }, [subcatid]);

  async function fetchprodsbysubcat() {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/fetchprodsbysubcatid?sid=${subcatid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setprodsdata(resp.data.proddata);
        } else {
          setprodsdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Products</span>
          </h3>
        </div>
      </div>

      <div className="products-page">
        <div className="container">
          {prodsdata.length > 0 ? (
            <ul className="product-list">
              {prodsdata.map((item) => (
                <li className="product-item" key={item._id}>
                  <div className="product-left">
                    <Link to={`/details?pid=${item._id}`}>
                      <img
                        src={`uploads/${item.picture}`}
                        alt={item.pname}
                        className="product-image"
                      />
                    </Link>
                  </div>
                  <div className="product-right">
                    <h3 className="product-name">{item.pname}</h3>
                    <div className="product-price">
                      {item.Discount && item.Discount > 0 ? (
                        <>
                          <span className="price-discounted">
                            ₹
                            {Math.round(
                              item.Rate - (item.Rate * item.Discount) / 100
                            )}
                          </span>
                          <span className="price-original">₹{item.Rate}</span>
                        </>
                      ) : (
                        <span className="price-current">₹{item.Rate}</span>
                      )}
                    </div>
                    <div className="product-actions">
                      <Link
                        to={`/details?pid=${item._id}`}
                        className="btn view-btn"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`btn cart-btn ${
                          item.Stock <= 0 ? "disabled" : ""
                        }`}
                        disabled={item.Stock <= 0}
                      >
                        {item.Stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <h2 className="no-products">No products found</h2>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .products-page {
          padding: 30px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          min-height: 80vh;
        }

        .product-list {
          list-style: none;
          padding: 0;
          margin: 0 auto;
          max-width: 900px;
        }

        .product-item {
          display: flex;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 18px;
          padding: 12px 15px;
          align-items: center;
          gap: 15px;
        }

        .product-left {
          flex-shrink: 0;
          width: 130px;
          height: 130px;
          overflow: hidden;
          border-radius: 6px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-left a:hover .product-image {
          transform: scale(1.05);
        }

        .product-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0; /* important for text truncation on narrow screens */
        }

        .product-name {
          font-size: 20px;
          font-weight: 600;
          color: #222;
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-price {
          font-size: 18px;
          margin-bottom: 14px;
        }

        .price-discounted {
          font-weight: 700;
          color: #28a745;
          margin-right: 10px;
        }

        .price-original {
          text-decoration: line-through;
          color: #999;
          font-size: 15px;
        }

        .price-current {
          font-weight: 700;
          color: #007bff;
        }

        .product-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: background 0.25s ease;
          min-width: 110px;
          text-align: center;
        }

        .view-btn {
          background-color: #007bff;
          color: white;
          text-decoration: none;
          line-height: 1.3;
        }

        .view-btn:hover {
          background-color: #0056b3;
        }

        .cart-btn {
          background-color: #28a745;
          color: white;
        }

        .cart-btn:hover:not(.disabled) {
          background-color: #1e7e34;
        }

        .cart-btn.disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .no-products {
          text-align: center;
          font-size: 22px;
          color: #666;
          padding: 60px 0;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .product-item {
            flex-direction: column;
            align-items: flex-start;
            height: auto;
          }

          .product-left {
            width: 100%;
            height: 200px;
            margin-bottom: 12px;
          }

          .product-right {
            width: 100%;
          }

          .product-name {
            white-space: normal;
          }

          .product-actions {
            justify-content: flex-start;
          }

          .btn {
            min-width: 100px;
            font-size: 14px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </>
  );
}

export default Products;
