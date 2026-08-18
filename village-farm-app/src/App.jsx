import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
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
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import Categories from "./admin/pages/Categories";
import Products from "./admin/pages/Products";
import Customers from "./admin/pages/Customers";
import Orders from "./admin/pages/Orders";
import DeliveryManagement from "./admin/pages/DeliveryManagement";
import Reports from "./admin/pages/Reports";
import AdminOrderDetails from "./admin/pages/OrderDetails";
import Profile from "./admin/pages/Profile";

// Delivery Partner Portal
import DeliveryProtectedRoute from "./routes/DeliveryProtectedRoute";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AssignedOrders from "./pages/delivery/AssignedOrders";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";

function App() {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public Admin & Delivery Partner Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />

      {/* Customer Protected Routes */}
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

      {/* ================= DELIVERY PARTNER ROUTES ================= */}
      <Route
        path="/delivery"
        element={
          <DeliveryProtectedRoute>
            <DeliveryLayout />
          </DeliveryProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/delivery/dashboard" replace />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="assigned-orders" element={<AssignedOrders />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="delivery" element={<DeliveryManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;