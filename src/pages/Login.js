import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/easytask-logo.png";
import bgImage from "../assets/images/Task-amico.png";

const { Title } = Typography;

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem("jira_users") || "{}");

    if (isRegistering) {
      if (users[username]) {
        return message.error("Username already exists.");
      }
      users[username] = { password, tasks: [] };
      localStorage.setItem("jira_users", JSON.stringify(users));
      message.success("Registered successfully!");
      setIsRegistering(false);
    } else {
      if (!users[username] || users[username].password !== password) {
        return message.error("Invalid username or password.");
      }
      localStorage.setItem("jira_current_user", username);
      message.success("Login successful!");
      navigate("/my-task");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(to right, #ede9f3, #f5f3fa)",
        position: "relative",
      }}
    >
      <img
        src={logo}
        alt="EasyTask Logo"
        style={{
          position: "absolute",
          top: 10,
          left: 32,
          width: 200,
          filter: "drop-shadow(0 4px 6px rgba(123, 97, 255, 0.2))",
        }}
      />
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
            padding: "2rem",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Title level={3} style={{ color: "#7b61ff", marginBottom: 32 }}>
            Welcome to EasyTask
          </Title>
          <Form layout="vertical" onFinish={handleSubmit} style={{ width: "100%" }}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: "#7b61ff", borderColor: "#7b61ff" }}
              >
                {isRegistering ? "Register" : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: "#7b61ff" }}
          >
            {isRegistering ? "Already have an account? Login" : "New user? Register"}
          </Button>
        </div>
      </div>
    </div>
  );
}
