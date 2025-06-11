import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Subcategories() {
  const [params] = useSearchParams();
  const catid = params.get("cid");
  const [subcatdata, setsubcatdata] = useState([]);

  async function fetchsubcatbycat() {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/getallsubcat?cid=${catid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setsubcatdata(resp.data.subcatdata);
        } else {
          setsubcatdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (catid !== "") {
      fetchsubcatbycat();
    }
  }, [catid]);

  return (
    <>
            <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Subcategories</span>
          </h3>
        </div>
      </div>

      <div className="subcategory-section">
        <div className="subcategory-container">
          {subcatdata.length > 0 ? (
            subcatdata.map((item, index) => (
              <div
                key={index}
                className={`subcategory-row ${index % 2 !== 0 ? "reverse" : ""}`}
              >
                <div className="subcategory-text">
                  <h2>{item.subcatname}</h2>
                  <p>Explore a wide collection of stylish {item.subcatname} perfect for every season. Quality and comfort blended for your fashion statement.</p>
                  <Link to={`/products?sid=${item._id}`} className="shop-btn">Shop Now</Link>
                </div>
                <div className="subcategory-image-wrapper">
                  <img
                    src={`uploads/${item.subcatpic}`}
                    alt={item.subcatname}
                    className="subcategory-img"
                  />
                </div>
              </div>
            ))
          ) : (
            <h2 className="no-data">No Subcategories found</h2>
          )}
        </div>
      </div>

      <style jsx>{`
        .blue-bg {
          background: linear-gradient(to right, #007bff, #00c6ff);
          color: white;
          padding: 20px 0;
          text-align: center;
        }
        .breadcrumb-link {
          color: white;
          text-decoration: underline;
        }
        .subcategory-section {
          padding: 60px 20px;
          background-color: #f9f9f9;
        }
        .subcategory-container {
          display: flex;
          flex-direction: column;
          gap: 60px;
          max-width: 1200px;
          margin: auto;
        }
        .subcategory-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .subcategory-row.reverse {
          flex-direction: row-reverse;
        }
        .subcategory-text {
          flex: 1;
          min-width: 280px;
        }
        .subcategory-text h2 {
          font-size: 28px;
          font-weight: 700;
          color: #000;
        }
        .subcategory-text p {
          font-size: 16px;
          color: #555;
          margin: 10px 0 20px;
        }
        .shop-btn {
          background-color: #000;
          color: #fff;
          padding: 10px 22px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
        .subcategory-image-wrapper {
          flex: 1;
          min-width: 280px;
        }
        .subcategory-img {
          width: 100%;
          max-width: 420px;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .no-data {
          text-align: center;
          font-size: 22px;
          color: #777;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .subcategory-row {
            flex-direction: column !important;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export default Subcategories;
