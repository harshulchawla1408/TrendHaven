import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Privacy Policy</span>
          </h3>
        </div>
      </div>
      <div className="policy-page">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: June 7, 2025</p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              At Trend Haven, we collect the following information to process
              your orders and provide better service:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping and billing address</li>
              <li>
                Payment details (processed securely through our payment gateway)
              </li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Improve our products and services</li>
              <li>Send promotional offers (only with your consent)</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Protection</h2>
            <p>
              We implement a variety of security measures to maintain the safety
              of your personal information. Your personal data is contained
              behind secured networks and is only accessible by a limited number
              of persons who have special access rights to such systems.
            </p>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>
              <strong>
                We do not share your data with third parties without your
                explicit consent,
              </strong>{" "}
              except as necessary to provide our services or as required by law.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
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
                <a href="mailto:contact@trendhaven.com">
                  contact@trendhaven.com
                </a>
              </p>
            </address>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
