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
      {currentUser && !isLoginPage && <Navbar />}

      <Routes>
        {/* หน้า Login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า Task */}
        <Route path="/my-task" element={<TaskManager />} />
        <Route path="/information-task/:key" element={<TaskDetail />} />

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
