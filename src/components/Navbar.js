import React from "react";
import { Layout, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleTwoTone } from "@ant-design/icons";


const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  const username = localStorage.getItem("jira_current_user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jira_current_user");
    navigate("/login");
  };

  return (
    <Header className="custom-header">
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <CheckCircleTwoTone twoToneColor="#52c41a" />
      <Title level={4} style={{ color: "white", margin: 0 }}>
        My To Do Lists
      </Title>
    </div>
    {username && (
      <div style={{ display: "flex", gap: 16, alignItems: "center", color: "white" }}>
        👤 {username}
        <Button size="small" onClick={handleLogout}>Logout</Button>
      </div>
    )}
  </Header>
  );
}
