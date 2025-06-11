import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-toastify";
function ChangePassword() {
  const [currpass, setcurrpass] = useState();
  const [newpass, setnewpass] = useState();
  const [cnewpass, setcnewpass] = useState();
  const [msg, setmsg] = useState();
  const navigate = useNavigate();

  const { udata, setudata } = useContext(userContext);

  useEffect(() => {
    if (sessionStorage.getItem("userdata") === null) {
      toast.error("Please login to access the page");
      navigate("/login");
    }
  }, [navigate]);

  async function onchangepass(e) {
    e.preventDefault();
    const uname = udata.username;
    const apidata = { currpass, newpass, uname };
    try {
      if (newpass === cnewpass) {
        const resp = await axios.put(
          "http://localhost:9000/api/changepassword",
          apidata
        );
        if (resp.status === 200) {
          if (resp.data.statuscode === 0) {
            toast.info("Incorrect Current Password");
          } else if (resp.data.statuscode === 1) {
            toast.success("Password changed successfully");
            setudata(null);
            sessionStorage.clear();
            navigate("/homepage");
          }
        } else {
          setmsg("Some error occured");
        }
      } else {
        toast.warning("New Password and confirm new password does not match");
      }
    } catch (err) {}
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Change Password</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile">
            <h3>Change Password</h3>
            <form name="form1" onSubmit={onchangepass}>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="pass"
                  placeholder="Current Password"
                  onChange={(e) => setcurrpass(e.target.value)}
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="pass"
                  placeholder="New Password"
                  required=" "
                  onChange={(e) => setnewpass(e.target.value)}
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="pass"
                  placeholder="Confirm New Password"
                  required=" "
                  onChange={(e) => setcnewpass(e.target.value)}
                />
                <div className="clearfix"></div>
              </div>
              <input type="submit" name="btn" value="Change Password" />
              {msg}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChangePassword;
