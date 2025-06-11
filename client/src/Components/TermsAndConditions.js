import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const TermsAndConditions = () => {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Terms and Conditions</span>
          </h3>
        </div>
      </div>
      <div className="policy-page">
        <div className="container">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Last Updated: June 7, 2025</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Trend Haven. These terms and conditions outline the
              rules and regulations for the use of Trend Haven's Website,
              located at [Your Website URL].
            </p>
            <p>
              By accessing this website, we assume you accept these terms and
              conditions. Do not continue to use Trend Haven if you do not agree
              to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2>2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, Trend Haven
              and/or its licensors own all the intellectual property rights and
              materials contained in this Website.
            </p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <p>As a user of our website, you agree not to:</p>
            <ul>
              <li>Use our products for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use our website to transmit any viruses or malicious code</li>
            </ul>
          </section>

          <section>
            <h2>4. Ordering and Payment</h2>
            <p>
              By placing an order through our website, you warrant that you are
              legally capable of entering into binding contracts.
            </p>
            <p>
              All prices are in Indian Rupees (₹) and are inclusive of all
              taxes. We reserve the right to change prices at any time without
              prior notice.
            </p>
          </section>

          <section>
            <h2>5. Shipping and Delivery</h2>
            <p>
              Please refer to our{" "}
              <Link to="/shipping-policy">Shipping Policy</Link> for detailed
              information about shipping methods, costs, and delivery times.
            </p>
          </section>

          <section>
            <h2>6. Returns and Refunds</h2>
            <p>
              For information about returns and refunds, please see our{" "}
              <Link to="/cancellation-policy">Cancellation Policy</Link>.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall Trend Haven, nor any of its officers, directors,
              and employees, be held liable for anything arising out of or in
              any way connected with your use of this website.
            </p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>
              Trend Haven reserves the right to update these terms and
              conditions at any time. We will notify you of any changes by
              posting the new terms and conditions on this page.
            </p>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please
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
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
