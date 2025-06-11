import "./style.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categories() {
  const [catdata, setcatdata] = useState([]);

  async function fetchallcat() {
    try {
      const resp = await axios.get("http://localhost:9000/api/getallcat");
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setcatdata(resp.data.catdata);
        } else {
          setcatdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchallcat();
  }, []);

  return (
    <>
      <div className="banner1">
              <div className="container">
                <h3>
                  <Link to="/">Home</Link> / <span>Categories</span>
                </h3>
              </div>
            </div>

      <div className="category-grid">
        <div className="category-container">
          {catdata.length > 0 ? (
            catdata.map((item, index) => (
              <div className="category-card" key={index}>
                <img
                  src={`uploads/${item.catpic}`}
                  alt={item.catname}
                  className="category-image"
                />
                <div className="category-info">
                  <h2>{item.catname}</h2>
                  <p>
                    Discover the latest styles in {item.catname} fashion.
                    Explore handpicked collections that match your vibe.
                  </p>
                  <Link
                    to={`/subcategories?cid=${item._id}`}
                    className="explore-btn"
                  >
                    Explore {item.catname}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <h2 className="no-data">No Categories Available</h2>
          )}
        </div>
      </div>

      <style jsx>{`
        .category-banner {
          background: linear-gradient(to right, #fc466b, #3f5efb);
          color: white;
          padding: 30px 0;
          text-align: center;
        }

        .breadcrumb-link {
          color: white;
          text-decoration: underline;
        }

        .category-grid {
          background-color: #f9f9f9;
          padding: 60px 20px;
        }

        .category-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
        }

        .category-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-10px);
        }

        .category-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          object-position: top;
        }

        .category-info {
          padding: 24px;
          text-align: center;
        }

        .category-info h2 {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .category-info p {
          font-size: 15px;
          color: #666;
          margin-bottom: 18px;
        }

        .explore-btn {
          background-color: #000;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .explore-btn:hover {
          background-color: #333;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .category-info h2 {
            font-size: 20px;
          }

          .category-image {
            height: 200px;
          }
        }
      `}</style>
    </>
  );
}

export default Categories;
