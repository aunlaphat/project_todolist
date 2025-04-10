import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Input, Select, message } from "antd";
import { PlusOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { loadTasks, saveTasks } from "./utils/localStorage";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import TaskTable from "./components/TaskTable";
import TaskModal from "./components/TaskModal";
import TaskDetail from "./components/TaskDetail";
import TaskManager from "./components/TaskManager";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { generateTaskKey } from "./utils/keyGenerator";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const AppRoutes = () => {
  const currentUser = localStorage.getItem("jira_current_user");
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {currentUser && !isLoginPage && <Navbar />}

      <Routes>
        {!currentUser && <Route path="*" element={<Navigate to="/login" replace />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/my-task" element={<TaskManager />} />
        <Route path="/information-task/:key" element={<TaskDetail />} />
        {currentUser && <Route path="/" element={<Navigate to="/my-task" replace />} />}
      </Routes>
    </>
  );
};

export default function App() {
  const currentUser = localStorage.getItem("jira_current_user");
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
