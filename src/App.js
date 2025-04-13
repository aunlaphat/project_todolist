import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate, } from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import TaskManager from "./components/TaskManager";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

const AppRoutes = () => {
  const currentUser = localStorage.getItem("jira_current_user");
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* แสดง Navbar ถ้า login แล้วและไม่ใช่หน้า login */}
      {currentUser && !isLoginPage && <Navbar />}

      <Routes>
        {/* หน้า Login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า Task */}
        <Route path="/my-task" element={<TaskManager />} />
        <Route path="/information-task/:key" element={<TaskDetail />} />

        {/* เส้นทางหลัก / → พาไปหน้า login หรือ my-task ตามสถานะ */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/my-task" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* fallback ถ้าพิมพ์ url มั่ว */}
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/my-task" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
