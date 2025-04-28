import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Orders from "../pages/Orders";
import CategoryPage from "../pages/CategoryPage";
import Dashboard from "../pages/Dashboard";
import ItemsDashboard from "../pages/ItemsDashboard";
import OrdersDashboard from "../pages/OrdersDashboard";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <AdminRoute>
              <ItemsDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrdersDashboard />
            </AdminRoute>
          }
        />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
