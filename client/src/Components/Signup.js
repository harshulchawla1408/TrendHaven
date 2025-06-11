import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();
  

  async function onRegister(e) {
    e.preventDefault();
    if (terms) {
      if (pass === cpass) {
        const regdata = { name, phone, uname, pass };
        try {
          const resp = await axios.post("http://localhost:9000/api/signup", regdata);
          toast.success("Signup successful");
          navigate("/login");
        } catch (err) {
          toast.error("Signup failed");
        }
      } else {
        toast.warn("Password and Confirm Password do not match");
      }
    } else {
      toast.warn("Please accept terms & conditions");
    }
  }

  return (
    <>
      {/* Banner */}
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Register</span>
          </h3>
        </div>
      </div>

      {/* Signup Page with Background Image */}
      <div
        style={{
          minHeight: "80vh",
          backgroundImage: "url('/images/signup.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        {/* Blur Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            zIndex: 1,
          }}
        ></div>

        {/* Signup Card */}
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "480px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "24px",
              color: "#1565C0",
            }}
          >
            Register
          </h3>

          <form onSubmit={onRegister}>
            {[
              {
                icon: "fa-user",
                type: "text",
                value: name,
                set: setName,
                placeholder: "Name",
              },
              {
                icon: "fa-phone",
                type: "tel",
                value: phone,
                set: setPhone,
                placeholder: "Phone Number",
              },
              {
                icon: "fa-envelope",
                type: "email",
                value: uname,
                set: setUname,
                placeholder: "Email Address (Username)",
              },
              {
                icon: "fa-lock",
                type: "password",
                value: pass,
                set: setPass,
                placeholder: "Password",
              },
              {
                icon: "fa-lock",
                type: "password",
                value: cpass,
                set: setCpass,
                placeholder: "Confirm Password",
              },
            ].map((field, index) => (
              <div
                key={index}
                style={{ marginBottom: "20px", position: "relative" }}
              >
                <i
                  className={`fa ${field.icon}`}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                  }}
                ></i>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "15px",
                  }}
                />
              </div>
            ))}

            <div
              style={{
                marginBottom: "15px",
                fontSize: "14px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <input
                type="checkbox"
                id="terms"
                onChange={(e) => setTerms(e.target.checked)}
                style={{ marginRight: "10px", marginTop: "3px" }}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  style={{ color: "#007bff", textDecoration: "underline" }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  style={{ color: "#007bff", textDecoration: "underline" }}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <input
              type="submit"
              value="Register"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#1565C0",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0d47a1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1565C0")}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
