import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const ShippingPolicy = () => {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Shipping Policy</span>
          </h3>
        </div>
      </div>
      <div className="policy-page">
        <div className="container">
          <h1>Shipping Policy</h1>
          <p className="last-updated">Last Updated: June 7, 2025</p>

          <section>
            <h2>1. Order Processing Time</h2>
            <p>
              All orders are processed within <strong>1-2 business days</strong>{" "}
              (excluding weekends and public holidays) after receiving your
              order confirmation email. You will receive an email when your
              order has been shipped.
            </p>
          </section>

          <section>
            <h2>2. Shipping Options & Delivery Time</h2>
            <p>We offer the following shipping options:</p>
            <ul>
              <li>
                <strong>Standard Shipping:</strong> 5-7 business days
              </li>
              <li>
                <strong>Express Shipping:</strong> 2-4 business days (additional
                charges apply)
              </li>
            </ul>
            <p>
              Delivery times are estimates and commence from the date of
              shipping, rather than the date of order. Delivery times may vary
              due to:
            </p>
            <ul>
              <li>Peak holiday seasons</li>
              <li>Weather conditions</li>
              <li>Customs clearance for international orders</li>
            </ul>
          </section>

          <section>
            <h2>3. Shipping Rates</h2>
            <p>
              We offer{" "}
              <strong>free standard shipping on all orders above ₹999</strong>.
              For orders below ₹999, a flat shipping fee of ₹99 will be applied.
            </p>
            <p>
              Express shipping is available at an additional charge of ₹199,
              regardless of order value.
            </p>
          </section>

          <section>
            <h2>4. Shipping Destinations</h2>
            <p>
              We currently ship to all major cities and towns across India. For
              remote locations, additional delivery time may be required.
            </p>
          </section>

          <section>
            <h2>5. Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive a shipping
              confirmation email with tracking information. You can track your
              order using the provided tracking number on our website or the
              courier's website.
            </p>
          </section>

          <section>
            <h2>6. Shipping Partners</h2>
            <p>We work with trusted shipping partners including:</p>
            <ul>
              <li>Delhivery</li>
              <li>Ecom Express</li>
              <li>DTDC</li>
              <li>Blue Dart</li>
            </ul>
            <p>
              The shipping partner will be selected based on your location and
              the nature of the product.
            </p>
          </section>

          <section>
            <h2>7. International Shipping</h2>
            <p>
              Currently, we only ship within India. We will update this policy
              when we start international shipping.
            </p>
          </section>

          <section>
            <h2>8. Shipping to P.O. Boxes</h2>
            <p>
              We do not ship to P.O. boxes. Please provide a complete street
              address for delivery.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our shipping policy, please
              contact us at:
            </p>
            <address>
              <p>Harshul Chawla</p>
              <p>
                Phone: <a href="tel:+917814272742">+91 7814272742</a>
              </p>
              <p>Address: 123, Model Town, Jalandhar, Punjab 144001</p>
              <p>
                Email:{" "}
                <a href="mailto:shipping@trendhaven.com">
                  shipping@trendhaven.com
                </a>
              </p>
            </address>
          </section>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
