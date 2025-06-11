import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function ViewOrders() {
  const [ordersdata, setordersdata] = useState([]);
  const navigate = useNavigate();
  async function fetchorders() {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getallorders`);
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setordersdata(resp.data.ordersdata);
        } else {
          setordersdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchorders();
  }, []);

  async function updatestatus(id) {
    navigate("/updatestatus?oid=" + id);
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>List of Orders</span>
          </h3>
        </div>
      </div>

      <div className="login">
        <div className="container">
          {ordersdata.length > 0 ? (
            <>
              <h2>List of Orders</h2>
              <br />
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Address</th>
                    <th>Bill Amount</th>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersdata.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/orderitems?orderno=${item._id}`}
                          className="text-primary fw-bold"
                        >
                          {item._id}
                        </Link>
                      </td>
                      <td>{item.saddress}</td>
                      <td>{item.billamt}</td>
                      <td>{item.username}</td>
                      <td>{item.OrderDate}</td>
                      <td>{item.PayMode}</td>
                      <td>{item.status}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => updatestatus(item._id)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h3>Number of orders = {ordersdata.length} </h3>
            </>
          ) : (
            <h2>No orders found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default ViewOrders;
