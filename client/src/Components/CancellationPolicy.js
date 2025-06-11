import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const CancellationPolicy = () => {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Cancellation Policy</span>
          </h3>
        </div>
      </div>
      <div className="policy-page">
        <div className="container">
          <h1>Cancellation & Refund Policy</h1>
          <p className="last-updated">Last Updated: June 7, 2025</p>

          <section>
            <h2>1. Order Cancellation</h2>
            <p>
              You can cancel your order before it has been shipped. Once the
              order has been shipped, it cannot be cancelled. To cancel your
              order:
            </p>
            <ol>
              <li>Go to 'My Orders' in your account</li>
              <li>Select the order you want to cancel</li>
              <li>Click on 'Cancel Order'</li>
              <li>Select the reason for cancellation</li>
              <li>Submit the cancellation request</li>
            </ol>
            <p>
              You will receive a confirmation email once your cancellation is
              processed.
            </p>
          </section>

          <section>
            <h2>2. Refund Policy</h2>
            <h3>2.1 Eligibility for Refund</h3>
            <p>Refunds are applicable in the following cases:</p>
            <ul>
              <li>Order is cancelled before shipment</li>
              <li>Product received is damaged or defective</li>
              <li>Wrong product is delivered</li>
              <li>Product not as described on the website</li>
            </ul>

            <h3>2.2 Refund Process</h3>
            <p>
              Once we receive your return and verify the condition of the
              product, we will initiate the refund to your original method of
              payment. Refunds typically take 5-7 business days to reflect in
              your account, depending on your bank's processing time.
            </p>
          </section>

          <section>
            <h2>3. Return Policy</h2>
            <h3>3.1 Return Window</h3>
            <p>
              You may return most new, unopened items within 7 days of delivery
              for a full refund. Items should be in their original condition
              with all tags and packaging intact.
            </p>

            <h3>3.2 Non-Returnable Items</h3>
            <p>The following items cannot be returned:</p>
            <ul>
              <li>Personalized or custom-made products</li>
              <li>Perishable goods</li>
              <li>Intimate or sanitary goods</li>
              <li>Products marked as "Final Sale" or "Non-Returnable"</li>
            </ul>

            <h3>3.3 Return Process</h3>
            <ol>
              <li>Contact our customer support to initiate a return</li>
              <li>
                You will receive a Return Merchandise Authorization (RMA) number
              </li>
              <li>Pack the item securely with all original packaging</li>
              <li>Include the RMA number on the package</li>
              <li>Ship the item to the provided return address</li>
            </ol>
          </section>

          <section>
            <h2>4. Exchange Policy</h2>
            <p>
              We currently do not offer direct exchanges. If you need a
              different item, you may return the original item for a refund and
              place a new order for the item you want.
            </p>
          </section>

          <section>
            <h2>5. Late or Missing Refunds</h2>
            <p>
              If you haven't received your refund within the expected time
              frame, please:
            </p>
            <ol>
              <li>Check your bank account again</li>
              <li>
                Contact your credit card company as it may take some time for
                the refund to be processed
              </li>
              <li>
                Contact your bank as there may be processing time before a
                refund is posted
              </li>
              <li>
                If you've done all of this and still have not received your
                refund, please contact us at{" "}
                <a href="mailto:returns@trendhaven.com">
                  returns@trendhaven.com
                </a>
              </li>
            </ol>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>
              For any questions regarding our cancellation and refund policy,
              please contact our customer support team:
            </p>
            <address>
              <p>Harshul Chawla</p>
              <p>
                Phone: <a href="tel:+917814272742">+91 7814272742</a> (Mon-Sat,
                10AM-7PM)
              </p>
              <p>
                Email:{" "}
                <a href="mailto:support@trendhaven.com">
                  support@trendhaven.com
                </a>
              </p>
              <p>Address: 123, Model Town, Jalandhar, Punjab 144001</p>
            </address>
            <p>
              Our customer support team will respond to your query within 24-48
              business hours.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default CancellationPolicy;
