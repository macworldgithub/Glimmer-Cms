import Login from "./auth/login";
import MainLayout from "./layout/MainLayout.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store.tsx";
import Dashboard from "./pages/Dashboard.tsx";

import OrderDetails from "./pages/OrderDetails.tsx";
import OrderList from "./pages/OrderList.tsx";

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

          {/* Nested routes */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="orderList" element={<OrderList />} />
          <Route path="orderDetails" element={<OrderDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
