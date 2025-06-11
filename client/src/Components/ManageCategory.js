import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ManageCategory() {
  const [catid, setcatid] = useState();
  const [cname, setcname] = useState();
  const [cpic, setcpic] = useState(null);
  const [msg, setmsg] = useState();
  const [catdata, setcatdata] = useState([]);
  const [picname, setpicname] = useState();
  const [editmode, seteditmode] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userdata") === null) {
      toast.error("Please login first to access this page");
      navigate("/login");
    } else {
      var uinfo = JSON.parse(sessionStorage.getItem("userdata"));
      if (uinfo.usertype !== "admin") {
        toast.error("Please login first to access this page");
        navigate("/login");
      }
    }
  }, []);

  async function fetchallcat() {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getallcat`);
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setcatdata(resp.data.catdata);
        } else {
          setcatdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchallcat();
  }, []);

  async function addcategory(e) {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("catname", cname);
      if (cpic !== null) {
        formdata.append("catpic", cpic);
      }
      const resp = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/savecategory`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Category added successfully");
          oncancel();
          fetchallcat();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Category not added");
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  async function updatedb() {
    try {
      const formdata = new FormData();
      formdata.append("catname", cname);

      if (cpic !== null) {
        formdata.append("catpic", cpic);
      }
      formdata.append("oldpicname", picname);
      formdata.append("cid", catid);
      const resp = await axios.put(
        `${process.env.REACT_APP_BACKEND}/api/updatecategory`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Category updated successfully");
          oncancel();
          fetchallcat();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Category not updated");
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  async function oncatdel(id) {
    var userresp = window.confirm("Are you sure to delete this category");
    if (userresp === true) {
      const resp = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/delcat/${id}`);
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Category deleted successfully");
          fetchallcat();
        } else if (resp.data.statuscode === 0) {
          alert("Category not deleted");
        }
      } else {
        alert("Some error occurred");
      }
    }
  }
  function onupdate(catitem) {
    seteditmode(true);
    setcname(catitem.catname);
    setpicname(catitem.catpic);
    setcatid(catitem._id);
  }
  function oncancel() {
    seteditmode(false);
    setcname("");
    setpicname("");
    setcatid("");
    setcpic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <a href="index.html">Home</a> / <span>Manage Category</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile">
            <h3>Manage Category</h3>

            <form name="form1" onSubmit={addcategory}>
              <div className="key">
                <input
                  type="text"
                  name="catname"
                  value={cname}
                  placeholder="Category Name"
                  required=" "
                  onChange={(e) => setcname(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              {editmode ? (
                <>
                  <div className="key">
                    <img src={`uploads/${picname}`} height="100" />
                    <br />
                    <h4>Choose new image, if required</h4>
                    <div className="clearfix"></div>
                  </div>
                </>
              ) : null}

              <input
                type="file"
                name="catpic"
                ref={fileInputRef}
                onChange={(e) => setcpic(e.target.files[0])}
              />
              <br />

              {editmode === false ? (
                <input type="submit" name="btn1" value="Add" />
              ) : null}
              {editmode ? (
                <>
                  <input
                    type="button"
                    className="btn btn-primary"
                    name="btn2"
                    value="Update"
                    onClick={updatedb}
                  />{" "}
                  &nbsp;
                  <input
                    type="button"
                    className="btn btn-primary"
                    name="btn3"
                    onClick={oncancel}
                    value="Cancel"
                  />
                </>
              ) : null}
              {msg}
            </form>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div classname="container">
        {catdata.length > 0 ? (
          <>
            <h2>Added Categories</h2>
            <br />
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Picture</th>
                  <th>Category Name</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {catdata.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img src={`uploads/${item.catpic}`} height="150" />
                    </td>
                    <td>{item.catname}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => onupdate(item)}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => oncatdel(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <h3>Number of Categories = {catdata.length}</h3>
          </>
        ) : (
          <h2>No categories found</h2>
        )}
      </div>
    </>
  );
}
export default ManageCategory;
