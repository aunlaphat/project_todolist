import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 360, margin: "4rem auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        {isRegistering ? "Register" : "Login"}
      </Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isRegistering ? "Register" : "Login"}
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="link"
        onClick={() => setIsRegistering(!isRegistering)}
        block
      >
        {isRegistering ? "Already have an account? Login" : "New user? Register"}
      </Button>
    </div>
  );
}
