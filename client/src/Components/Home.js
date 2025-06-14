import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import {
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import "react-slideshow-image/dist/styles.css";
import "./style.css";

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
function Home() {
  const [prodsdata, setProdsdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchlatestprods() {
    setIsLoading(true);
    setError(null);

    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/fetchnewprods`,
        { timeout: 10000 }
      );

      if (resp.data.statuscode === 1 && Array.isArray(resp.data.proddata)) {
        setProdsdata(resp.data.proddata);
      } else {
        setProdsdata([]);
        setError("No latest products found.");
        console.warn("No products found or empty response");
      }
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products. Please try again later.");
      setProdsdata([]);
    } finally {
      setIsLoading(false); // Stop loader
    }
  }

  // Call in useEffect (already correct)
  useEffect(() => {
    fetchlatestprods();
  }, []);
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Lavanya Chawla",
      role: "Fashion Designer",
      content:
        "The quality of clothes at Trend Haven is exceptional! I love how unique and stylish their collections are. Highly recommended!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      name: "Kanav Sharma",
      role: "Loyal Customer",
      content:
        "Fast shipping and amazing customer service. The clothes fit perfectly and the fabric quality is top-notch. Will shop again!",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    },
    {
      id: 3,
      name: "Gourav Doda",
      role: "Fashion Blogger",
      content:
        "Trend Haven never disappoints! Their latest collection is absolutely stunning. The attention to detail is remarkable.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star" />);
      } else {
        stars.push(<FaStar key={i} className="star empty" />);
      }
    }

    return <div className="rating">{stars}</div>;
  };

  return (
    <div className="home-page">
      <div className="slide-container">
        <Slide autoplay={true} duration={3000} transitionDuration={500}>
          {slideImages.map((slideImage, index) => (
            <div key={index} className="each-slide">
              <div
                className="slide-image"
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
          <b>
            <p className="hero-subtitle">
              Discover the latest trends in fashion with our exclusive
              collection
            </p>
          </b>
        </section>

        {/* Latest Products Section */}
        <section className="products-section container">
          <div className="section-header">
            <h1 className="section-heading">Latest Products</h1>
          </div>

          {isLoading ? (
            <div className="loader">Loading latest products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : prodsdata.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {prodsdata.map((item, index) => (
                <div className="product-card" key={index}>
                  {item.Discount > 0 && (
                    <div className="discount-badge">{item.Discount}% OFF</div>
                  )}
                  <Link
                    to={`/details?pid=${item._id}`}
                    className="product-link"
                  >
                    <div className="product-image">
                      <img
                        src={`/uploads/${item.picture}`}
                        alt={item.pname}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{item.pname}</h3>
                      <div className="price-container">
                        {item.Discount > 0 ? (
                          <>
                            <span className="current-price">
                              ₹
                              {(
                                (item.Rate * (100 - item.Discount)) /
                                100
                              ).toFixed(2)}
                            </span>
                            <span className="original-price">
                              ₹{item.Rate.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="price">₹{item.Rate.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="product-category">{item.Category}</div>
                    </div>
                  </Link>
                  <div className="product-actions">
                    <Link
                      to={`/details?pid=${item._id}`}
                      className="view-details-btn"
                    >
                      <i className="fa fa-eye"></i> View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Video Banner Section */}
        <section className="video-banner">
          <div className="container">
            <div className="video-container">
              <video autoPlay muted loop playsInline className="video-player">
                <source src="images/trendvideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <h2>Unleash Your Style</h2>
                <p>
                  Discover the perfect blend of comfort and fashion with our
                  latest collection
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-heading">Why Choose Us</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <h3>Fast Delivery</h3>
                <p>
                  Get your favorite items delivered to your doorstep within 2-3
                  business days with our express shipping.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaShieldAlt />
                </div>
                <h3>Premium Quality</h3>
                <p>
                  We source only the finest materials to ensure our products
                  meet the highest quality standards.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaExchangeAlt />
                </div>
                <h3>Easy Returns</h3>
                <p>
                  Not satisfied? Return your purchase within 30 days for a full
                  refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-heading">What Our Customers Say</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div className="testimonial-card" key={testimonial.id}>
                  <div className="testimonial-content">
                    <p>{testimonial.content}</p>
                    {renderRating(testimonial.rating)}
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Discount Banner */}
        <div class="accessories-w3l">
          <div class="container">
            <h3 class="tittle">20% Discount on</h3>
            <span>TRENDING DESIGNS</span>
            <Link to="/categories" className="button1">
              {" "}
              Shop Now
            </Link>
          </div>
        </div>
      </main>
      <style>
        {`
  @media (max-width: 768px) {
    .slide-container {
      height: auto;
    }

    .slide-container .each-slide {
      height: 200px;
    }

    .slide-container .slide-image {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .main-content {
      padding: 10px;
    }

    .hero-section h1.main-tagline {
      font-size: 24px;
      text-align: center;
    }

    .hero-subtitle {
      font-size: 16px;
      text-align: center;
      display: block;
      margin-top: 5px;
    }

    .products-section .section-heading {
      font-size: 22px;
      text-align: center;
    }

    .products-grid {
      grid-template-columns: 1fr !important;
      gap: 16px;
    }

    .video-container {
      position: relative;
      height: auto;
    }

    .video-player {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .video-overlay {
      position: absolute;
      top: 10%;
      left: 5%;
      right: 5%;
      text-align: center;
    }

    .video-overlay h2 {
      font-size: 22px;
    }

    .video-overlay p {
      font-size: 14px;
    }

    .features-grid {
      flex-direction: column;
      gap: 16px;
    }

    .testimonial-card {
      flex-direction: column;
      text-align: center;
    }

    .testimonial-author {
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .accessories-w3l .container {
      text-align: center;
      padding: 20px 10px;
      background-image: url('images/banner3.jpg');
      background-size: cover;
      background-position: center;
    }

    .accessories-w3l h3.tittle {
      font-size: 24px;
    }

    .accessories-w3l span {
      font-size: 16px;
      display: block;
      margin-bottom: 10px;
    }

    .accessories-w3l .button1 {
      display: inline-block;
      font-size: 14px;
      padding: 8px 16px;
      background-color: #000;
      color: white;
      border-radius: 4px;
      text-decoration: none;
    }
.loader {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: #444;
  padding: 2rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.error-message {
  text-align: center;
  color: #ff4d4f;
  background-color: #ffeaea;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 500;
  margin: 1rem auto;
  width: fit-content;
  max-width: 90%;
}
  @media screen and (max-width: 600px) {
  .error-message,
  .loader {
    font-size: 1rem;
    padding: 1rem;
  }
}

  }
`}
      </style>
    </div>
  );
}
export default Home;
