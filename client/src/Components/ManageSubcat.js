import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ManageSubCategory() {
  const [catid, setcatid] = useState();
  const [subcatid, setsubcatid] = useState();
  const [subcatname, setsubcatname] = useState();
  const [subcatpic, setsubcatpic] = useState(null);
  const [subcatdata, setsubcatdata] = useState([]);
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

  async function fetchAllCategories() {
    try {
      const resp = await axios.get("http://localhost:9000/api/getallcat");
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setcatdata(resp.data.catdata);
        } else {
          setcatdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function fetchAllSubCategories() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/getallsubcat?cid=${catid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setsubcatdata(resp.data.subcatdata);
        } else {
          setsubcatdata([]);
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchAllCategories();
  }, []);
  useEffect(() => {
    if (catid !== "") {
      fetchAllSubCategories();
    }
  }, [catid]);

  async function addSubCategory(e) {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("subcatname", subcatname);
      formdata.append("categoryid", catid);
      if (subcatpic !== null) {
        formdata.append("subcatpic", subcatpic);
      }
      const resp = await axios.post(
        `http://localhost:9000/api/savesubcategory`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Subcategory added successfully");
          onCancel();
          fetchAllSubCategories();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Subcategory not added");
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function updateSubCategory() {
    try {
      const formdata = new FormData();
      formdata.append("subcatname", subcatname);
      formdata.append("categoryid", catid);
      if (subcatpic !== null) {
        formdata.append("subcatpic", subcatpic);
      }
      formdata.append("oldpicname", picname);
      formdata.append("subcatid", subcatid);
      const resp = await axios.put(
        `http://localhost:9000/api/updatesubcategory`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Subcategory updated successfully");
          onCancel();
          fetchAllSubCategories();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Subcategory not updated");
        }
      } else {
        alert("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function onSubCatDel(id) {
    var userresp = window.confirm("Are you sure to delete this subcategory");
    if (userresp === true) {
      const resp = await axios.delete(
        `http://localhost:9000/api/delsubcat/${id}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Subcategory deleted successfully");
          fetchAllSubCategories();
        } else if (resp.data.statuscode === 0) {
          alert("Subcategory not deleted");
        }
      } else {
        alert("Some error occurred");
      }
    }
  }

  function onUpdate(subcatitem) {
    seteditmode(true);
    setsubcatname(subcatitem.subcatname);
    setpicname(subcatitem.subcatpic);
    setsubcatid(subcatitem._id);
    setcatid(subcatitem.catid);
  }

  function onCancel() {
    seteditmode(false);
    setsubcatname("");
    setpicname("");
    setsubcatid("");
    setsubcatpic(null);
    setcatid("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <a href="index.html">Home</a> / <span>Manage Subcategory</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile">
            <h3>Manage Subcategory</h3>
            <form name="form1" onSubmit={addSubCategory}>
              <select
                className="form-control"
                value={catid}
                onChange={(e) => setcatid(e.target.value)}
                required=""
              >
                <option value="">Select Category</option>
                {catdata.map((cat, index) => (
                  <option key={index} value={cat._id}>
                    {cat.catname}
                  </option>
                ))}
              </select>

              <div className="clearfix"></div>
              <br />

              <div className="key">
                <input
                  type="text"
                  name="subcatname"
                  value={subcatname}
                  placeholder="Name of the Subcategory"
                  required=" "
                  onChange={(e) => setsubcatname(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              {editmode ? (
                <>
                  <div className="key">
                    <img src={`uploads/${picname}`} height="100" />
                    <h4>Choose new image, if required</h4>
                    <div className="clearfix"></div>
                  </div>
                </>
              ) : null}

              <input
                type="file"
                name="subcatpic"
                ref={fileInputRef}
                onChange={(e) => setsubcatpic(e.target.files[0])}
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
                    onClick={updateSubCategory}
                  />{" "}
                  &nbsp;
                  <input
                    type="button"
                    className="btn btn-primary"
                    name="btn3"
                    onClick={onCancel}
                    value="Cancel"
                  />
                </>
              ) : null}
            </form>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="container">
        {subcatdata.length > 0 ? (
          <>
            <h2>Added Subcategories</h2>
            <br />
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Picture</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {subcatdata.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img src={`uploads/${item.subcatpic}`} height="150" />
                    </td>
                    <td>
                      {catdata.find((cat) => cat._id === item.catid)?.catname}
                    </td>
                    <td>{item.subcatname}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => onUpdate(item)}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => onSubCatDel(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <h3>Number of Subcategories = {subcatdata.length}</h3>
          </>
        ) : (
          <h2>No subcategories found</h2>
        )}
      </div>
    </>
  );
}

export default ManageSubCategory;
