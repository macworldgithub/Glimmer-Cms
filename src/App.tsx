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

function App() {
  // const isAuthenticated = useSelector(
  //   (state: RootState) => state.Login.isAuthenticated
  // );

  const isAuthenticated = true;

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
          <Route index element={<Navigate to="products" replace />} />
          <Route index element={<Navigate to="add-product" replace />} />
          <Route index element={<Navigate to="category-list" replace />} />

          {/* Nested routes */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="orderList" element={<OrderList />} />
          <Route path="orderDetails" element={<OrderDetails />} />

          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<Add_Product />} />
          <Route path="category-list" element={<Category_List />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
