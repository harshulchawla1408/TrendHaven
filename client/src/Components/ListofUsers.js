import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ListofUsers() {
  const [membsdata, setmembsdata] = useState([]);

  async function fetchusers() {
    try {
      const resp = await axios.get("http://localhost:9000/api/getallusers");
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setmembsdata(resp.data.membersdata);
        } else {
          setmembsdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchusers();
  }, []);

  async function onmembdel(id) {
    var userresp = window.confirm("Are you sure to delete");
    if (userresp === true) {
      const resp = await axios.delete(
        `http://localhost:9000/api/deluser/${id}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("User deleted successfully");
          fetchusers();
        } else if (resp.data.statuscode === 0) {
          alert("User not deleted");
        }
      } else {
        alert("Some error occurred");
      }
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>List of Users</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {membsdata.length > 0 ? (
            <>
              <h2>List of Users</h2>
              <br />
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Username</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {membsdata.map((item, index) => (
                    <tr key={index}>
                      <td>{item.pname}</td>
                      <td>{item.phone}</td>
                      <td>{item.username}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => onmembdel(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h3>Number of users = {membsdata.length} </h3>
            </>
          ) : (
            <h2>No users found</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default ListofUsers;
