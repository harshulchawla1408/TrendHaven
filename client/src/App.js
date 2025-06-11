import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect, useState } from "react";
import Header from "./Components/Header";
import SiteRoutes from "./Components/SiteRoutes";
import Footer from "./Components/Footer";
import AdminHeader from "./Components/AdminHeader";
import { CartProvider } from "./Components/CartContext";
import Chatbot from "./Components/Chatbot";

const userContext = createContext(null);

function App() {
  const [udata, setudata] = useState(null);

  // ✅ Fix: Run only once on mount
  useEffect(() => {
    const handleUserChange = () => {
      const userData = sessionStorage.getItem("userdata");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const prevData = udata;
        // Prevent cart clear if same user
        if (!prevData || (prevData && prevData.username !== parsedData.username)) {
          localStorage.removeItem("cart");
        }
        setudata(parsedData);
      } else {
        setudata(null);
      }
    };

    // Initial load
    handleUserChange();

    // Listen for sessionStorage updates (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "userdata") {
        handleUserChange();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); 

  return (
    <>
      <userContext.Provider value={{ udata, setudata }}>
        <CartProvider>
          {udata === null ? (
            <Header />
          ) : udata.usertype === "admin" ? (
            <AdminHeader />
          ) : (
            <Header />
          )}
          <SiteRoutes />
          <Footer />
        </CartProvider>
      </userContext.Provider>
      <ToastContainer theme="colored" />
      <Chatbot />
    </>
  );
}

// Export userContext as a named export
export { userContext };
// Export App as the default export
export default App;
