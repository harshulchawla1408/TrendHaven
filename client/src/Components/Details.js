import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { useCart } from "./CartContext";
import "./style.css";

function Details() {
  const [params] = useSearchParams();
  const prodid = params.get("pid");

  const [proddata, setproddata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remcost, setremcost] = useState(0);
  const [qty, setqty] = useState(1);
  const [stock, setstock] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();

  const { udata } = useContext(userContext);
  const { addToCart } = useCart();

  // Dummy colors (could come from proddata if you want)
  const colors = [
    { id: 1, name: "Blue", code: "#6875F5" },
    { id: 2, name: "Green", code: "#4B7262" },
    { id: 3, name: "Black", code: "#000000" },
    { id: 4, name: "Pink", code: "#F6C2C2" },
  ];

  // Dummy sizes
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL"];

  useEffect(() => {
    fetchproddetails();
  }, [prodid]);

  useEffect(() => {
    if (!proddata) return;

    if (proddata.Rate !== undefined && proddata.Discount !== undefined) {
      const discountedPrice =
        proddata.Rate - (proddata.Discount * proddata.Rate) / 100;
      setremcost(parseFloat(discountedPrice.toFixed(2)));
    } else {
      setremcost(proddata.Rate || 0);
    }

    const stockArr = [];
    const stockLimit = proddata.Stock > 10 ? 10 : proddata.Stock || 0;
    for (let x = 1; x <= stockLimit; x++) {
      stockArr.push(x);
    }
    setstock(stockArr);

    if(colors.length) setSelectedColor(colors[0].id);
    if(sizes.length) setSelectedSize(sizes[0]);
  }, [proddata]);

  function increaseQty() {
    if (qty < (proddata.Stock || 10)) setqty(qty + 1);
  }

  function decreaseQty() {
    if (qty > 1) setqty(qty - 1);
  }

  async function fetchproddetails() {
    if (!prodid) {
      toast.error("Invalid product ID");
      setproddata(null);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/getproddetails?pid=${prodid}`
      );

      let productData = null;
      if (resp.data && (resp.data._id || resp.data.pname)) {
        productData = resp.data;
      } else if (
        resp.data?.data &&
        (resp.data.data._id || resp.data.data.pname)
      ) {
        productData = resp.data.data;
      } else if (resp.data?.statuscode === 1 && resp.data.product) {
        productData = resp.data.product; 
      } else if (resp.data?.statuscode === 1 && resp.data.proddata) {
        productData = resp.data.proddata;
      }

      if (productData) {
        setproddata(productData);
      } else {
        toast.error("Unexpected product data format");
      }
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
      setproddata(null);
    } finally {
      setIsLoading(false);
    }
  }

  function addtocart() {
    if (!proddata) return;

    if (udata === null) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.info("Please select a size");
      return;
    }

    const productToAdd = {
      _id: prodid,
      picture: proddata.picture || "",
      pname: proddata.pname || "Product",
      Rate: remcost,
      quantity: qty,
      Stock: proddata.Stock || 0,
      color: colors.find(c => c.id === selectedColor)?.name || "",
      size: selectedSize,
    };

    addToCart(productToAdd);
    toast.success("Product added to cart!");
  }

  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!proddata) {
    return <div className="error">Product not found</div>;
  }

  // Dummy reviews count and rating
  const dummyRating = 5.0;
  const dummyReviewsCount = 120;

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Product Details</span>
          </h3>
        </div>
      </div>

      <div className="products container" style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
        {/* Left image section */}
        <div className="product-image" style={{ flex: 1, position: "relative" }}>
          {proddata.picture && (
            <>
              <img
                src={`uploads/${proddata.picture}`}
                alt={proddata.pname || "Product image"}
                className="img-responsive"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              {/* Could add arrows for carousel */}
              <button className="arrow left">&#8592;</button>
              <button className="arrow right">&#8594;</button>
            </>
          )}
        </div>

        {/* Right info section */}
        <div className="product-info" style={{ flex: 1 }}>
          <h2>{proddata.pname}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ color: "#FFB800", fontWeight: "bold" }}>
              ⭐ {dummyRating.toFixed(1)}
            </span>
            <span style={{ fontSize: "14px", color: "#666" }}>
              ({dummyReviewsCount} reviews)
            </span>
          </div>

          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>
            ₹{remcost.toFixed(2)}{" "}
            {proddata.Discount > 0 && (
              <span className="original-price" style={{ textDecoration: "line-through", fontWeight: "normal", color: "#999", marginLeft: "10px" }}>
                ₹{parseFloat(proddata.Rate).toFixed(2)}
              </span>
            )}
          </div>

          {/* Color selector */}
          <div style={{ marginBottom: "15px" }}>
            <label><b>Select Color</b></label>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {colors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  style={{
                    backgroundColor: color.code,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: selectedColor === color.id ? "2px solid black" : "1px solid #ccc",
                  }}
                  title={color.name}
                ></div>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div style={{ marginBottom: "20px" }}>
            <label><b>Select Size</b></label>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? "size-btn selected" : "size-btn"}
                  style={{
                    padding: "8px 14px",
                    border: selectedSize === size ? "2px solid black" : "1px solid #ccc",
                    backgroundColor: selectedSize === size ? "#000" : "#fff",
                    color: selectedSize === size ? "#fff" : "#000",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
            <label><b>Quantity</b></label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px" }}>
              <button
                onClick={decreaseQty}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#eee",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  userSelect: "none"
                }}
              >−</button>
              <input
                type="text"
                readOnly
                value={qty.toString().padStart(2, "0")}
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "16px"
                }}
              />
              <button
                onClick={increaseQty}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#eee",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  userSelect: "none"
                }}
              >+</button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "15px" }}>
            <button
              onClick={addtocart}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                border: "1px solid #000",
                cursor: "pointer",
                fontWeight: "bold",
                borderRadius: "6px"
              }}
            >
              Add to cart
            </button>
          </div>

          {/* Short description */}
          <b><i><p style={{ fontSize: "14px", color: "#666" }}>
            {proddata.Description} </p></i></b>

          {/* Accordion sections */}
          <div style={{ marginTop: "25px" }}>
            <Accordion title="Description">
              <p>{proddata.Description}</p>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>Delivery within 5-7 working days. Free shipping for orders above ₹999.</p>
              <p>Easy 7-day return available for damaged or wrong items. Cancellations allowed before dispatch only.</p>
              <p>For more information, you can visit our <b><Link to = "/shipping-policy">Shipping policy</Link></b> and <b><Link to = "/cancellation-policy">Refund and Cancellation policy</Link> </b></p>

            </Accordion>
            <Accordion title="Details">
              <p>Weight: 500g</p>
              <p>Material: Brushed fleece</p>
              <p>Care: Machine washable</p>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: "15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: "bold" }}
      >
        {title}
        <span>{open ? "-" : "+"}</span>
      </div>
      {open && <div style={{ paddingBottom: "10px", color: "#555" }}>{children}</div>}
    </div>
  );
}

export default Details;
