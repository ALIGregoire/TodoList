import React from "react";
import Register from "./pages/authPage/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authPage/Login";
import Dashboard from "./pages/dashboardPage/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";
import Profile from "./pages/authPage/profile";
import StatisticsPage from "./pages/dashboardPage/statistiquePage/StatisticsPage";

import "flowbite";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistique" element={<StatisticsPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
