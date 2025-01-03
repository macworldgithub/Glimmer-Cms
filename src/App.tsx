import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./auth/login";
import MainLayout from "./layout/MainLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";

import OrderDetails from "./pages/OrderDetails.tsx";
import OrderList from "./pages/OrderList.tsx";

import Add_Product from "./pages/Product/Add_Product.tsx";
import Category_List from "./pages/Product/Category_List.tsx";
import ProductList from "./pages/Product/Product_List.tsx";

import { useSelector } from "react-redux";
import { RootState } from "./store/store.tsx";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.Login.isAuthenticated
  );

  // const isAuthenticated = false;

  return (
    <Router>
      <Routes>
        {/* Unprotected Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
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
          <Route index element={<Navigate to="dashboard" replace />} />
          {/* <Route index element={<Navigate to="Product_List" replace />} />
          <Route index element={<Navigate to="Add_Product" replace />} />
          <Route index element={<Navigate to="Category_List" replace />} /> */}

          {/* Nested routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orderList" element={<OrderList />} />
          <Route path="orderDetails" element={<OrderDetails />} />
          <Route path="Product_List" element={<ProductList />} />
          <Route path="Add_Product" element={<Add_Product />} />
          <Route path="Category_List" element={<Category_List />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
