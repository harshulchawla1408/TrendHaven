import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [params] = useSearchParams();
  const sterm = params.get("s");

  const [prodsdata, setprodsdata] = useState([]);
  useEffect(() => {
    if (sterm !== "") {
      searchprods();
    }
  }, [sterm]);

  async function searchprods() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/searchproducts?q=${sterm}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setprodsdata(resp.data.proddata);
        } else {
          setprodsdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Searched Products</span>
          </h3>
        </div>
      </div>

      <div className="login">
        <div className="container">
          {prodsdata.length > 0 ? (
            prodsdata.map((item, index) => (
              <div className="col-md-4 top_brand_left" key={index}>
                <div className="hover14 column">
                  <div className="agile_top_brand_left_grid">
                    <div className="agile_top_brand_left_grid1">
                      <figure>
                        <div className="snipcart-item block">
                          <div className="snipcart-thumb">
                            <Link to={`/details?pid=${item._id}`}>
                              <img
                                title=" "
                                alt=" "
                                src={`uploads/${item.picture}`}
                                height="125"
                              />
                              <h3>{item.pname}</h3>
                            </Link>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No products found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default SearchProducts;
