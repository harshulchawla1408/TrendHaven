import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ManageProduct() {
  const [catid, setcatid] = useState("");
  const [pid, setpid] = useState("");
  const [subcatid, setsubcatid] = useState("");
  const [pname, setpname] = useState("");
  const [rate, setrate] = useState("");
  const [dis, setdis] = useState("");
  const [stock, setstock] = useState("");
  const [descp, setdescp] = useState("");
  const [picture, setpicture] = useState(null);

  const [catdata, setcatdata] = useState([]);
  const [subcatdata, setsubcatdata] = useState([]);
  const [prodsdata, setprodsdata] = useState([]);

  const [picname, setpicname] = useState("");
  const [editmode, setEditmode] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  async function fetchallcat() {
    try {
      const resp = await axios.get("http://localhost:9000/api/getallcat");
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setcatdata(resp.data.catdata);
        } else {
          setcatdata([]);
        }
      } else {
        toast.error("Oops! Something went wrong");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchallcat();
  }, []);

  useEffect(() => {
    if (catid !== "") {
      fetchallsubcat();
    }
  }, [catid]);

  async function fetchallsubcat() {
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
        toast.error("Oops! Something went wrong");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (subcatid !== "") {
      fetchProdsBySubcat();
    }
  }, [subcatid]);

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
  }, [navigate]);

  async function fetchProdsBySubcat() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/fetchprodsbysubcatid?sid=${subcatid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setprodsdata(resp.data.proddata);
        } else {
          setprodsdata([]);
          toast.info("No products found");
        }
      } else {
        toast.error("Some error occurred");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("catid", catid);
      formdata.append("subcatid", subcatid);
      formdata.append("pname", pname);
      formdata.append("rate", rate);
      formdata.append("dis", dis);
      formdata.append("stock", stock);
      formdata.append("descp", descp);

      if (picture !== null) {
        formdata.append("picture", picture);
      }

      const resp = await axios.post(
        `http://localhost:9000/api/saveproduct`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Product added successfully");
          fetchProdsBySubcat();
          onCancel();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Product not added");
        }
      } else {
        toast.error("Some error occurred");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function updateProduct() {
    try {
      const formdata = new FormData();
      formdata.append("catid", catid);
      formdata.append("subcatid", subcatid);
      formdata.append("pname", pname);
      formdata.append("rate", rate);
      formdata.append("dis", dis);
      formdata.append("stock", stock);
      formdata.append("descp", descp);

      if (picture !== null) {
        formdata.append("picture", picture);
      }

      formdata.append("oldpicname", picname);
      formdata.append("pid", pid);

      const resp = await axios.put(
        `http://localhost:9000/api/updateproduct`,
        formdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Product updated successfully");
          fetchProdsBySubcat();
          onCancel();
        } else if (resp.data.statuscode === 0) {
          toast.warn("Product not updated");
        }
      } else {
        toast.error("Some error occurred");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function onDelete(id) {
    var userresp = window.confirm("Are you sure to delete this product?");
    if (userresp === true) {
      const resp = await axios.delete(
        `http://localhost:9000/api/delproduct/${id}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          toast.success("Product deleted successfully");
          fetchProdsBySubcat();
        } else if (resp.data.statuscode === 0) {
          toast.error("Product not deleted");
        }
      } else {
        toast.error("Some error occurred");
      }
    }
  }

  function onUpdate(prodItem) {
    setEditmode(true);
    setpname(prodItem.pname);
    setrate(prodItem.Rate);
    setdis(prodItem.Discount);
    setstock(prodItem.Stock);
    setdescp(prodItem.Description);
    setpicname(prodItem.picture);
    setcatid(prodItem.catid);
    setsubcatid(prodItem.subcatid);
    setpid(prodItem._id);
  }

  function onCancel() {
    setEditmode(false);
    setpname("");
    setrate("");
    setdis("");
    setstock("");
    setdescp("");
    setpicname("");
    setcatid("");
    setsubcatid("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <a href="index.html">Home</a> / <span>Manage Products</span>
          </h3>
        </div>
      </div>

      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile">
            <h3>Manage Product</h3>
            <form name="form1" onSubmit={addProduct}>
              <select
                className="form-control"
                name="cat"
                onChange={(e) => setcatid(e.target.value)}
              >
                <option value="">Choose Category</option>
                {catdata.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.catname}
                  </option>
                ))}
              </select>
              <br />
              <select
                className="form-control"
                name="subcat"
                onChange={(e) => setsubcatid(e.target.value)}
              >
                <option value="">Choose Subcategory</option>
                {subcatdata.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.subcatname}
                  </option>
                ))}
              </select>

              <div className="clearfix"></div>
              <br />

              <div className="key">
                <input
                  type="text"
                  name="prodname"
                  value={pname}
                  placeholder="Name of the Product"
                  required=" "
                  onChange={(e) => setpname(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              <div className="key">
                <input
                  type="text"
                  name="rate"
                  value={rate}
                  placeholder="Rate"
                  required=" "
                  onChange={(e) => setrate(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              <div className="key">
                <input
                  type="text"
                  name="dis"
                  value={dis}
                  placeholder="Discount(in percent, do not add % symbol)"
                  required=" "
                  onChange={(e) => setdis(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              <div className="key">
                <input
                  type="text"
                  name="stock"
                  value={stock}
                  placeholder="Stock available"
                  required=" "
                  onChange={(e) => setstock(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>
              <div className="key">
                <textarea
                  className="form-control"
                  name="descp"
                  value={descp}
                  placeholder="Description"
                  required=" "
                  onChange={(e) => setdescp(e.target.value)}
                />
                <div className="clearfix"></div>
                <br />
              </div>

              {editmode ? (
                <>
                  <div className="key">
                    <img
                      src={`uploads/${picname}`}
                      height="100"
                      alt="Product"
                    />
                    <h4>Choose new image, if required</h4>
                    <div className="clearfix"></div>
                  </div>
                </>
              ) : null}

              <input
                type="file"
                name="ppic"
                ref={fileInputRef}
                onChange={(e) => setpicture(e.target.files[0])}
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
                    onClick={updateProduct}
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

      {prodsdata.length > 0 ? (
        <>
          <h2>Added Products</h2>
          <br />
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Picture</th>
                <th>Product Name</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {prodsdata.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`uploads/${item.picture}`}
                      height="75"
                      alt="Product"
                    />
                  </td>
                  <td>{item.pname}</td>
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
                      onClick={() => onDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <h3>Number of products = {prodsdata.length}</h3>
        </>
      ) : (
        <h2>No products found</h2>
      )}
    </>
  );
}
export default ManageProduct;
