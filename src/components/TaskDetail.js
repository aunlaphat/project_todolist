import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadTasks } from "../utils/localStorage";
import {Card, Typography, Tag, Space, Button, Divider, Progress, Table, } from "antd";
import {LeftOutlined, ThunderboltOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined,
 ShareAltOutlined, AppstoreAddOutlined, CloseOutlined, EyeOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, } = Typography;

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

  const childTasks = task.children || [];

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      render: (key) => <Tag color="blue">{key}</Tag>,
    },
    {
      title: "Summary",
      dataIndex: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "DONE" ? "green" : "default"} style={{ fontWeight: 600 }}>
          {status}
        </Tag>
      ),
    },
  ];

  const doneCount = childTasks.filter((t) => t.status === "DONE").length;
  const percentDone = childTasks.length ? Math.round((doneCount / childTasks.length) * 100) : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
          กลับไปยัง Task ทั้งหมด
        </Button>

        <Space>
          <Button icon={<ThunderboltOutlined />}>Improve issue</Button>
          <Button icon={<EyeOutlined />}>1</Button>
          <Button icon={<ShareAltOutlined />} />
          <Button icon={<CloseOutlined />} />
        </Space>
      </div>

      <Card bordered bodyStyle={{ padding: 24 }}>
        <Space size="large" direction="horizontal" style={{ marginBottom: 16 }}>
          <Tag color="#b37feb" style={{ fontSize: 16 }}>{task.key}</Tag>
          <Title level={3} style={{ margin: 0 }}>
            {task.title}
          </Title>
          <Button icon={<AppstoreAddOutlined />} size="small" style={{ marginLeft: 8 }}>
            Add
          </Button>
        </Space>

        <Text type="secondary">{task.description || "ไม่มีคำอธิบายเพิ่มเติม"}</Text>

        {childTasks.length > 0 && (
          <>
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Child issues</Text>
            <Progress percent={percentDone} showInfo={false} style={{ marginTop: 8, marginBottom: 16 }} />
            <Table
              columns={columns}
              dataSource={childTasks}
              rowKey="key"
              size="small"
              pagination={false}
              bordered
            />
          </>
        )}

        <Divider />

        <Text strong style={{ fontSize: 16 }}>Details</Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: 12 }}>
          <Space>
            <UserOutlined />
            <Text>
              <strong>Assigned:</strong> {task.assignee || <Text type="secondary">Unassigned</Text>}
            </Text>
          </Space>
          <Space>
            <CheckCircleOutlined />
            <Text>
              <strong>Status:</strong> {task.status}
            </Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>
              <strong>Due Date:</strong>{" "}
              {task.dueDate ? dayjs(task.dueDate).format("MMM D, YYYY") : "-"}
            </Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>
              <strong>Created:</strong>{" "}
              {task.createdAt ? dayjs(task.createdAt).format("MMM D, YYYY") : "-"}
            </Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>
              <strong>Updated:</strong>{" "}
              {task.updatedAt ? dayjs(task.updatedAt).format("MMM D, YYYY") : "-"}
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetail;
