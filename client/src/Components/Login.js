import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-toastify";

function Login() {
  const [uname, setuname] = useState();
  const [pass, setpass] = useState();
  const navigate = useNavigate();
  const { setudata } = useContext(userContext);

  async function onlogin(e) {
    e.preventDefault();
    const logindata = { uname, pass };
    try {
      const resp = await axios.post("http://localhost:9000/api/login", logindata);
      if (resp.status === 200) {
        if (resp.data.statuscode === 0) {
          toast.warn("Incorrect Username/Password");
        } else if (resp.data.statuscode === 1) {
          setudata(resp.data.pdata);
          sessionStorage.setItem("userdata", JSON.stringify(resp.data.pdata));
          navigate("/homepage");
          toast.success("Logged in successfully");
        }
      } else {
        toast.warn("Some error occurred");
      }
    } catch (err) {
      toast.error("Server error");
    }
  }

  return (
    <>
      {/* Banner */}
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Login</span>
          </h3>
        </div>
      </div>

      {/* Login Background */}
      <div
        style={{
          minHeight: "80vh",
          backgroundImage: "url('/images/login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          overflow: "hidden",
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
            background: "rgba(255, 255, 255, 0.4)",
            zIndex: 1,
          }}
        ></div>

        {/* Login Card */}
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "420px",
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
            Login
          </h3>
          <form onSubmit={onlogin}>
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <i
                className="fa fa-envelope"
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
                type="text"
                name="un"
                placeholder="Email Address (Username)"
                required
                onChange={(e) => setuname(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <i
                className="fa fa-lock"
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
                type="password"
                name="pass"
                placeholder="Password"
                required
                onChange={(e) => setpass(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <input
              type="submit"
              value="Login"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#1565c0",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0d47a1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1565c0")}
            />
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#1565C0", textDecoration: "none" }}
            >
              Sign up
            </Link>
          </p>

          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              marginTop: "10px",
              color: "#777",
            }}
          >
            By logging in, you agree to our{" "}
            <Link
              to="/terms-and-conditions"
              style={{ color: "#555", textDecoration: "underline" }}
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              style={{ color: "#555", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
