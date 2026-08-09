import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/OrderDetails";
import MyOrders from "./pages/MyOrders";

import ProtectedRoute from "./routes/ProtectedRoute";

// Admin
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import Categories from "./admin/pages/Categories";
import Products from "./admin/pages/Products";
import Customers from "./admin/pages/Customers";
import Orders from "./admin/pages/Orders";
import Delivery from "./admin/pages/Delivery";
import Reports from "./admin/pages/Reports";
import DeliveryManagement from "./admin/pages/DeliveryManagement";
import AdminOrderDetails from "./admin/pages/OrderDetails";
import Profile from "./admin/pages/Profile";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category/:id"
        element={
          <ProtectedRoute>
            <CategoryProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ROUTES ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="reports" element={<Reports />} />
        <Route
          path="delivery"
          element={<DeliveryManagement />}
        />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 */}

      <Route path="*" element={<Navigate to="/" replace />} />


    </Routes>
  );
}

export default App;