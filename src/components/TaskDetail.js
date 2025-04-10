import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadTasks } from "../utils/localStorage";
import { Card, Typography, Tag, Space, Button, Divider } from "antd";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const findTaskByKey = (list, key) => {
  for (const item of list) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findTaskByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const TaskDetail = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const tasks = loadTasks();
    const found = findTaskByKey(tasks, key);
    setTask(found);
  }, [key]);

  if (!task) {
    return <div style={{ padding: 40 }}>ไม่พบงานที่คุณเลือก</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <Button onClick={() => navigate("/")} style={{ marginBottom: 16 }}>
        ← กลับไปยัง Task ทั้งหมด
      </Button>
      <Card bordered>
        <Title level={3}>
          {task.title} <Tag color="blue">{task.key}</Tag>
        </Title>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text>
            🗂 <strong>Priority:</strong> {task.priority || "-"}
          </Text>
          <Text>
            ✅ <strong>Status:</strong> {task.status === "DONE" ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}
          </Text>
          <Text>
            👤 <strong>Assignee:</strong> {task.assignee || "-"}
          </Text>
          <Text>
            📅 <strong>Due Date:</strong>{" "}
            {task.dueDate ? dayjs(task.dueDate).format("DD MMM YYYY") : "-"}
          </Text>
          <Text>
            🕓 <strong>Created:</strong>{" "}
            {task.createdAt ? dayjs(task.createdAt).format("DD MMM YYYY") : "-"}
          </Text>
          <Text>
            🔁 <strong>Updated:</strong>{" "}
            {task.updatedAt ? dayjs(task.updatedAt).format("DD MMM YYYY") : "-"}
          </Text>

          <Divider />

          <Text strong>รายละเอียด</Text>
          <Paragraph>{task.description || "ไม่มีรายละเอียดเพิ่มเติม"}</Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default TaskDetail;
