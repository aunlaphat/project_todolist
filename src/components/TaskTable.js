import React from "react";
import {Table, Checkbox, Tooltip, DatePicker, Button, Select, Space, Typography, Tag, } from "antd";
import {EditOutlined,DeleteOutlined,CopyOutlined,PlusOutlined,CalendarOutlined,AlignLeftOutlined,UserOutlined,ClockCircleOutlined, NumberOutlined, ThunderboltOutlined, DownOutlined, RightOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";
import { PRIORITY_OPTIONS } from "../data/constants";
import { statusColorMap } from "../utils/statusColors";

const { Paragraph } = Typography;

const TaskTable = ({tasks, onStatusChange, onEdit, onDelete, onInlineUpdate, onOpenDetail, onAddSubtask, onToggleExpand, setTasks, }) => {
  const handleCopyLink = (key) => {
    const url = `${window.location.origin}/information-task/${key}`;
    navigator.clipboard.writeText(url);
  };

  const flattenTasks = (list, level = 0) => {
      return list.reduce((acc, task) => {
        const item = { ...task, level };
        acc.push(item);
    
        if (task.expanded && task.children?.length > 0) {
          acc.push(...flattenTasks(task.children, level + 1));
        }
    
        return acc;
      }, []);
  };
    
  const flattenedData = flattenTasks(tasks);
  
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
        width: 200,
        render: (priority, record) => {
          const isSubtask = record.level > 0;
          const hasChildren = record.children && record.children.length > 0;
      
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: isSubtask ? 16 * record.level : 0,
              }}
            >
              {/* Expand/Collapse */}
              {hasChildren ? (
                <Button
                  icon={record.expanded ? <DownOutlined /> : <RightOutlined />}
                  size="small"
                  type="text"
                  onClick={() => onToggleExpand(record.key)}
                  style={{ marginRight: 4 }}
                />
              ) : (
                <span style={{ width: 22, marginRight: 4 }} />
              )}
      
              {/* Priority Dropdown */}
              <Select
                value={priority}
                onChange={(val) => onInlineUpdate(record.key, "priority", val)}
                options={PRIORITY_OPTIONS}
                style={{ width: 80 }}
                dropdownStyle={{ minWidth: 100 }}
                popupMatchSelectWidth={false}
              />
      
              {/* Add Subtask */}
              <Button
                icon={<PlusOutlined />}
                size="small"
                type="text"
                onClick={() =>
                  onEdit({ parentId: record.key, level: (record.level || 0) + 1 })
                }
                style={{ marginLeft: 4 }}
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
        width: 200,
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
        width: 200,
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
          width: 80,
          key: "status",
          render: (status) => (
            <Tag
              color={statusColorMap[status] || "default"}
              style={{ fontWeight: "bold", textTransform: "uppercase" }}
            >
              {status}
            </Tag>
          ),
      },
      {
        title: (
          <Space>
            <UserOutlined />
            Assigned
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
        width: 120,
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
            </Tooltip>
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.key)} />
            </Tooltip>
          </Space>
        ),
      },
  ];

  return (
    <Table
      columns={columns}
      dataSource={flattenedData}
      rowKey="key"
      pagination={false}
      scroll={{ x: 1200 }}
      bordered
      rowClassName={() => "task-row"}
      expandable={{
        childrenColumnName: "__DO_NOT_EXPAND__", 
        expandIconColumnIndex: -1, 
      }}
    />
  );
};

export default TaskTable;
