import React from "react";
import {
  Table,
  Checkbox,
  Tooltip,
  Input,
  DatePicker,
  Button,
  Select,
  Space,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
  CalendarOutlined,
  AlignLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PRIORITY_OPTIONS } from "../data/constants";

const { Paragraph } = Typography;

const TaskTable = ({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onInlineUpdate,
  onOpenDetail,
}) => {
  const handleCopyLink = (key) => {
    const url = `${window.location.origin}/information-task/${key}`;
    navigator.clipboard.writeText(url);
  };

  const columns = [
    {
      title: "",
      dataIndex: "status",
      width: 50,
      fixed: "left",
      render: (_, record) => (
        <Checkbox
          checked={record.status === "DONE"}
          onChange={(e) => onStatusChange(record.key, e.target.checked)}
        />
      ),
    },
    {
      title: (
        <Space>
          <ThunderboltOutlined />
          Priority
        </Space>
      ),
      dataIndex: "priority",
      width: 100,
      render: (priority, record) => {
        const isSubtask = record.level > 0;
        return (
          <div style={{ paddingLeft: isSubtask ? 16 * record.level : 0 }}>
            <Select
              value={priority}
              onChange={(val) => onInlineUpdate(record.key, "priority", val)}
              options={PRIORITY_OPTIONS}
              style={{ width: 80 }}
              dropdownStyle={{ minWidth: 100 }}
              dropdownMatchSelectWidth={false}
            />
          </div>
        );
      },
    },
    {
      title: (
        <Space>
          <NumberOutlined />
          Key
        </Space>
      ),
      dataIndex: "key",
      width: 150,
      render: (key, record) => (
        <Space>
          <Button type="link" onClick={() => onOpenDetail(key)}>
            {key}
          </Button>
          <Tooltip title="Copy link">
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(key)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <AlignLeftOutlined />
          Summary
        </Space>
      ),
      dataIndex: "title",
      width: 300,
      render: (text, record) => (
        <Paragraph
        editable={{
          onChange: (val) => onInlineUpdate(record.key, "title", val),
        }}
        style={{ margin: 0 }}
      >
        {text}
      </Paragraph>
      
      ),
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined />
          Status
        </Space>
      ),
      dataIndex: "status",
      width: 120,
      render: (status) =>
        status === "DONE" ? "✅ Done" : "⏳ In Progress",
    },
    {
      title: (
        <Space>
          <UserOutlined />
          Assignee
        </Space>
      ),
      dataIndex: "assignee",
      width: 140,
      render: (text) => text || "-",
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          Due Date
        </Space>
      ),
      dataIndex: "dueDate",
      width: 160,
      render: (date, record) => (
        <DatePicker
          value={date ? dayjs(date) : null}
          onChange={(val) =>
            onInlineUpdate(record.key, "dueDate", val ? val.toISOString() : null)
          }
          format="MMM D, YYYY"
        />
      ),
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          Updated
        </Space>
      ),
      dataIndex: "updatedAt",
      width: 130,
      render: (date) =>
        date ? dayjs(date).format("MMM D, YYYY") : "-",
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          Created
        </Space>
      ),
      dataIndex: "createdAt",
      width: 130,
      render: (date) =>
        date ? dayjs(date).format("MMM D, YYYY") : "-",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.key)} />
          </Tooltip>
          <Tooltip title="Add Subtask">
            <Button icon={<PlusOutlined />} onClick={() => onEdit({ parentId: record.key, level: (record.level || 0) + 1 })} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="key"
      pagination={false}
      expandable={{
        childrenColumnName: "children",
        defaultExpandAllRows: true,
      }}
      scroll={{ x: 1200 }}
      bordered
      rowClassName={() => "task-row"}
    />
  );
};

export default TaskTable;
