import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./auth/login";
import MainLayout from "./layout/MainLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";

import OrderList from "./pages/OrderList.tsx";

import Ecommerce_Dashboard from "./pages/Ecommerce_Dashboard.tsx";
import Add_Product from "./pages/Product/Add_Product.tsx";
import Category_List from "./pages/Product/Category_List.tsx";
import ProductList from "./pages/Product/Product_List.tsx";
import Create_Category from "./pages/Create_category.tsx";
import { useSelector } from "react-redux";
import { RootState } from "./store/store.tsx";
import SignupStore from "./pages/SignupStore.tsx";
import Email from "./pages/Email.tsx";
import Storeactivity from "./pages/Storeactivity.tsx";
import { useEffect, useState } from "react";
import OrderDetailPage from "./pages/single-order-detail.tsx";
import Salon from "./pages/Salon.tsx";
import Salon_Dashboard from "./pages/Salon_Dashboard.tsx";
import Booking from "./pages/Booking.tsx";
import Services from "./pages/Services.tsx";
import Add_Services from "./pages/Add_Services.tsx";
import ServiceList from "./pages/Service_List.tsx";
import SuperAdmin_Services_List from "./pages/SuperAdmin_Services_List.tsx";
import SuperAdmin_Booking_List from "./pages/SuperAdmin_Booking_List.tsx";
import All_Salons_Services from "./pages/All_Salons_Services.tsx";
import All_Salons_Bookings from "./pages/All_Salons_Bookings.tsx";
import All_Salons_Recommemded_Products from "./pages/All_Salons_Recommemded_Products.tsx";
import All_Stores_Product from "./pages/All_Store_Products.tsx";
import All_Store_Orders from "./pages/All_Store_Orders.tsx";
import All_Salons_Highlights from "./pages/All_Salons_Highlights.tsx";
import All_Products_Highlights from "./pages/All_Products_Highlights.tsx";
import RecommendedProductsRouter from "./pages/RecommendedProductsRouter .tsx";

import ManageReviews from "./pages/ManageReviews.tsx"; // Import new component
import StoreReviews from "./pages/StoreReviews.tsx";
function App() {
  //  const isAuthenticated = false;
  const isAuthenticated = useSelector(
    (state: RootState) => state.Login.isAuthenticated
  );
  const role = useSelector((state: RootState) => state.Login.role);
  const [frontPage, setFrontPage] = useState("dasboard");

  useEffect(() => {
    if (role === "super_admin") {
      setFrontPage("dashboard");
    } else if (role === "store") {
      setFrontPage("E_Dashboard");
    } else if (role === "salon") {
      setFrontPage("S_Dashboard")
    }
  }, [role]);

  return (
    <Router>
      <Routes>
        {/* Unprotected Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${frontPage}`} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Protected Layout Route */}
        <Route
          path="/*"
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          {/* Default (index) route inside MainLayout */}
          <Route index element={<Navigate to={frontPage} replace />} />

          {/* Nested routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orderList" element={<OrderList />} />
          <Route path="order-details/:id" element={<OrderDetailPage />} />
          <Route path="Product_List" element={<ProductList />} />
          <Route path="Add_Product" element={<Add_Product />} />
          <Route path="Category_List" element={<Category_List />} />
          <Route path="Create_Category" element={<Create_Category />} />
          <Route path="makestore" element={<SignupStore />} />
          <Route path="salon" element={<Salon />} />
          <Route path="email" element={<Email />} />
          <Route path="store" element={<Storeactivity />} />

          <Route path="E_Dashboard" element={<Ecommerce_Dashboard />} />
          <Route path="S_Dashboard" element={<Salon_Dashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="services" element={<Services />} />
          <Route path="Add_Services" element={<Add_Services />} />
          <Route path="Manage_Services" element={<ServiceList />} />
          <Route path="SuperAdmin_Services_List" element={<SuperAdmin_Services_List />} />
          <Route path="SuperAdmin_Booking_List" element={<SuperAdmin_Booking_List />} />
          <Route path="All_Salons_Services" element={<All_Salons_Services />} />
          <Route path="All_Salons_Bookings" element={<All_Salons_Bookings />} />
          <Route path="All_Salons_Recommemded_Products" element={<All_Salons_Recommemded_Products />} />
          <Route path="Recommemded_Products" element={<RecommendedProductsRouter />} />
          <Route path="All_Stores_Product" element={<All_Stores_Product />} />
          <Route path="All_Store_Orders" element={<All_Store_Orders />} />
          <Route path="All_Salons_Highlights" element={<All_Salons_Highlights />} />
          <Route path="All_Products_Highlights" element={<All_Products_Highlights />} />
          <Route path="Manage_Review" element={<ManageReviews />} /> 
          <Route path="Store_Reviews" element={<StoreReviews />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
