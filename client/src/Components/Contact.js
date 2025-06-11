import React from "react";
import { Link } from "react-router-dom";

function ContactUs() {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Contact us</span>
          </h3>
        </div>
      </div>

      <div className="contact-wrapper">
        <div className="container">
          <h2>Contact Us</h2>
          <p className="description">
            We'd love to hear from you! Whether you have a question about products, orders, or anything else — our team is ready to help.
          </p>

          <div className="contact-grid">
            <div className="contact-box">
              <h3>📞 Phone</h3>
              <p>+91-7814272742</p>
            </div>
            <div className="contact-box">
              <h3>📧 Email</h3>
              <p>support@trendhaven.com</p>
            </div>
            <div className="contact-box">
              <h3>📍 Address</h3>
              <p>123 Model Town, Jalandhar, Punjab (144001)</p>
            </div>
          </div>

          <div className="map-container">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.406315933185!2d75.57934927449455!3d31.32601545778552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5b12f4d49ab5%3A0xa7f437f5a76f0c52!2sModel%20Town%2C%20Jalandhar%2C%20Punjab%20144001!5e0!3m2!1sen!2sin!4v1718012944077!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-banner {
          background: #1565c0;
          padding: 20px 0;
          color: white;
        }

        .contact-banner h3 {
          text-align: center;
          font-size: 20px;
        }

        .contact-wrapper {
          padding: 60px 20px;
          background: #f4f4f4;
        }

        .contact-wrapper h2 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 10px;
          color: #333;
        }

        .description {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 40px;
          font-size: 18px;
          color: #555;
        }

        .contact-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .contact-box {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          flex: 1 1 250px;
          max-width: 300px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .contact-box h3 {
          margin-bottom: 15px;
          font-size: 22px;
          color: #1565c0;
        }

        .contact-box p {
          font-size: 16px;
          color: #333;
        }

        .map-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .contact-grid {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}

export default ContactUs;
