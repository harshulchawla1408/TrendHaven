import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import { toast } from "react-toastify";
import "react-slideshow-image/dist/styles.css";
import "./style.css";
const spanStyle = {
  padding: "20px",
  background: "#efefef",
  color: "#000000",
};
const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "400px",
};
const slideImages = [
  {
    url: "images/b1.jpg",
    caption: "Slide 1",
  },
  {
    url: "images/b3.jpg",
    caption: "Slide 2",
  },
  {
    url: "images/b4.jpg",
    caption: "Slide 3",
  },
];
function AdminHome() {
  const [prodsdata, setprodsdata] = useState([]);
  const navigate = useNavigate();
  async function fetchlatestprods() {
    try {
      const resp = await axios.get(`http://localhost:9000/api/fetchnewprods`);
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setprodsdata(resp.data.proddata);
        } else {
          setprodsdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchlatestprods();
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("userdata") === null) {
      toast.error("Please login first to access this page");
      navigate("/login");
    } else {
      var uinfo = JSON.parse(sessionStorage.getItem("userdata"));
      if (uinfo.usertype !== "admin") {
        toast.error("Please login first to access this page");
        navigate("/login");
      }
    }
  }, [navigate]);
  return (
    <>
      <div className="login">
        <div className="container">
          <div className="slide-container">
            <Slide>
              {slideImages.map((slideImage, index) => (
                <div key={index}>
                  <div
                    style={{
                      ...divStyle,
                      backgroundImage: `url(${slideImage.url})`,
                    }}
                  ></div>
                </div>
              ))}
            </Slide>
          </div>

          <main className="main-content">
            <section className="hero-section">
              <h1 className="main-tagline">
                Trend Haven – Where Style Meets Elegance
              </h1>
            </section>
            <section className="products-section">
              <h2 className="section-heading">Latest Products</h2>
            </section>{" "}
          </main>
          {prodsdata.length > 0 ? (
            prodsdata.map((item, index) => (
              <div className="col-md-4 top_brand_left" key={index}>
                <div className="hover14 column">
                  <div className="agile_top_brand_left_grid">
                    <div className="agile_top_brand_left_grid1">
                      <figure>
                        <div className="snipcart-item block">
                          <div className="snipcart-thumb">
                            <Link to={`/details?pid=${item._id}`}>
                              <img
                                title=" "
                                alt=" "
                                src={`uploads/${item.picture}`}
                                height="100"
                              />
                              <h3>{item.pname}</h3>
                            </Link>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No products found</h2>
          )}
        </div>
      </div>
      <div class="accessories-w3l">
        <div class="container">
          <h3 class="tittle">20% Discount on</h3>
          <span>TRENDING DESIGNS</span>
          <div class="button">
            <Link to="/categories" className="button1">
              {" "}
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminHome;
