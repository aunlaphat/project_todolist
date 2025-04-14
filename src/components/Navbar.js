import React from "react";
import { Layout, Avatar, Tooltip, } from "antd";
import { QuestionCircleOutlined, SettingOutlined, BellOutlined, } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/easytask-logo.png";

const { Header } = Layout;

export default function Navbar() {
  const username = localStorage.getItem("jira_current_user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jira_current_user");
    navigate("/login");
  };

  return (
    <Header
    style={{
        background: "#E4C5FD",
        padding: "0 2rem",
        borderBottom: "1px solid #eaeaea",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ✅ ชื่อแอป */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={logo} alt="EasyTask Logo" style={{ height: 140, objectFit: "contain"}} />
      </div>

      {/* ✅ menu ต่าง ๆ */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Tooltip title="Notifications">
          <BellOutlined style={{ fontSize: 18 }} />
        </Tooltip>
        <Tooltip title="Help">
          <QuestionCircleOutlined style={{ fontSize: 18 }} />
        </Tooltip>
        <Tooltip title="Settings">
          <SettingOutlined style={{ fontSize: 18 }} />
        </Tooltip>
        <Tooltip title={`ออกจากระบบ (${username})`}>
          <Avatar
            style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
            onClick={handleLogout}
          >
            {username?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
    </Header>
  );
}
