import { Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home";
import Login from "./Login";
import SearchUser from "./SearchUser";
import ListofUsers from "./ListofUsers";
import ManageCategory from "./ManageCategory";
import ManageProduct from "./ManageProduct";
import ChangePassword from "./ChangePassword";
import Categories from "./Categories";
import Subcategories from "./Subcategories";
import Details from "./Details";
import ShowCart from "./ShowCart";
import Checkout from "./Checkout";
import OrderSummary from "./OrderSummary";
import ViewOrders from "./ViewOrders";
import OrderItems from "./OrderItems";
import UpdateStatus from "./UpdateStatus";
import OrderHistory from "./OrderHistory";
import SearchProducts from "./SearchProducts";
import AdminHome from "./AdminHome";
import ManageSubCategory from "./ManageSubcat";
import Products from "./Products";
import Contact from "./Contact";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import ShippingPolicy from "./ShippingPolicy";
import CancellationPolicy from "./CancellationPolicy";
import PaymentFailed from "./PaymentFailed";

function SiteRoutes()
{
    return(
        <>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/homepage" element={<Home/>}/>
            <Route path="/register" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/searchuser" element={<SearchUser/>}/>
            <Route path="/listofusers" element={<ListofUsers/>}/>
            <Route path="/managecategory" element={<ManageCategory/>}/>
            <Route path="/managesubcat" element={<ManageSubCategory/>}/>
            <Route path="/manageproduct" element={<ManageProduct/>}/>
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/subcategories" element={<Subcategories/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/details" element={<Details/>}/>
            <Route path="/showcart" element={<ShowCart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/ordersummary" element={<OrderSummary/>}/>
            <Route path="/vieworders" element={<ViewOrders/>}/>
            <Route path="/orderitems" element={<OrderItems/>}/>
            <Route path="/updatestatus" element={<UpdateStatus/>}/>
            <Route path="/orderhistory" element={<OrderHistory/>}/>
            <Route path="/searchresults" element={<SearchProducts/>}/>
            <Route path="/adminhome" element={<AdminHome/>}/>
            <Route path="/contactus" element={<Contact/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
            <Route path="/shipping-policy" element={<ShippingPolicy/>}/>
            <Route path="/cancellation-policy" element={<CancellationPolicy/>}/>
            <Route path="/paymentfailed" element={<PaymentFailed/>}/>
        </Routes>
        </>
    )
}
export default SiteRoutes;