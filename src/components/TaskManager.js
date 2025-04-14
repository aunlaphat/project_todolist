import React, { useEffect, useState } from "react";
import {Button, Input, message, Switch, } from "antd";
import {PlusOutlined, DownloadOutlined, UploadOutlined, BulbOutlined, FilterOutlined, } from "@ant-design/icons";
import { loadTasks, saveTasks } from "../utils/localStorage";
import { generateTaskKey } from "../utils/keyGenerator";
import { useNavigate, useLocation } from "react-router-dom";
import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";
import TaskFilterPanel from "./TaskFilterPanel";
import image from "../assets/images/Work in progress-amico.png";

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(prev => !prev);

  const location = useLocation();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    assignedToMe: false,
    dueThisWeek: false,
    doneOnly: false,
    dateRange: null,
    assignees: [], 
  });

  useEffect(() => {
    const data = loadTasks();
    setTasks(data);
  }, [location.pathname]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (task) => {
    const newKey = task.key || generateTaskKey();
    const newTask = {
      ...task,
      key: newKey,
      updatedAt: new Date(),
      createdAt: task.createdAt || new Date(),
      status: task.status || "TO DO",
    };

    if (task.key) {
      const updateTree = (list) =>
        list.map((t) =>
          t.key === newKey
            ? newTask
            : t.children
            ? { ...t, children: updateTree(t.children) }
            : t
        );
      setTasks(updateTree(tasks));
    } else if (task.parentId) {
      const addSubtask = (list) =>
        list.map((t) => {
          if (t.key === task.parentId) {
            return {
              ...t,
              children: t.children ? [newTask, ...t.children] : [newTask],
            };
          } else if (t.children) {
            return { ...t, children: addSubtask(t.children) };
          }
          return t;
        });
      setTasks(addSubtask(tasks));
    } else {
      setTasks([newTask, ...tasks]);
    }

    setModalOpen(false);
  };

  const handleDelete = (key) => {
    const removeTask = (list) =>
      list
        .filter((t) => t.key !== key)
        .map((t) =>
          t.children ? { ...t, children: removeTask(t.children) } : t
        );
    setTasks(removeTask(tasks));
  };

  const handleStatusChange = (key, checked) => {
    const update = (list) =>
      list.map((task) =>
        task.key === key
          ? { ...task, status: checked ? "DONE" : "TO DO", updatedAt: new Date() }
          : task.children
          ? { ...task, children: update(task.children) }
          : task
      );
    setTasks(update(tasks));
  };

  const handleToggleExpand = (key) => {
    const toggle = (list) =>
      list.map((task) => {
        if (task.key === key) {
          return { ...task, expanded: !task.expanded };
        }
        if (task.children) {
          return { ...task, children: toggle(task.children) };
        }
        return task;
      });
  
    setTasks(toggle(tasks));
  };

  const handleInlineUpdate = (key, field, value) => {
    const update = (list) =>
      list.map((task) =>
        task.key === key
          ? { ...task, [field]: value, updatedAt: new Date() }
          : task.children
          ? { ...task, children: update(task.children) }
          : task
      );
    setTasks(update(tasks));
  };

  const handleExport = () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setTasks(imported);
          message.success("Import สำเร็จแล้ว!");
        } else {
          message.error("ไฟล์ไม่ถูกต้อง");
        }
      } catch (err) {
        console.error(err);
        message.error("เกิดข้อผิดพลาดในการ Import");
      }
    };
    reader.readAsText(file);
  };

  const filterTasksPreserveExpand = (list, text) =>
    list
      .filter(task =>
        task.key?.toLowerCase().includes(text.toLowerCase()) ||
        task.title?.toLowerCase().includes(text.toLowerCase())
      )
      .map(task => ({
        ...task,
        children: task.children ? filterTasksPreserveExpand(task.children, text) : undefined,
      }));
  
  const filteredTasks = filterTasksPreserveExpand(tasks, searchText);
  
  const containerStyle = {
    backgroundColor: darkMode ? "#1f1f2e" : "#f4f2fa",
    color: darkMode ? "#fff" : "#333",
    minHeight: "100vh",
    padding: "2rem",
    position: "relative",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input.Search
          placeholder="ค้นหาโดย key หรือ summary"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button icon={<FilterOutlined />} onClick={toggleFilter}>Filter</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
          <Button icon={<UploadOutlined />} onClick={() => document.getElementById("import-file").click()}>Import</Button>
          <input type="file" id="import-file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{ backgroundColor: "#8BD348", borderColor: "#8BD348" }}
            onClick={handleAdd}
          >
            เพิ่ม Task
          </Button>
          <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            onChange={() => setDarkMode(!darkMode)}
            checked={darkMode}
          />
        </div>
      </div>

      <TaskTable
        tasks={filteredTasks}
        setTasks={setTasks}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInlineUpdate={handleInlineUpdate}
        onOpenDetail={(key) => navigate(`/information-task/${key}`)}
        onAddSubtask={(key) =>
          handleEdit({ parentId: key, level: 1 }) 
        }
        onToggleExpand={handleToggleExpand}
      />

      {showFilter && (
        <div style={{
          position: "absolute",
          top: 70,
          right: 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          zIndex: 2,
          padding: 16
        }}>
          <TaskFilterPanel
            filter={filter}
            setFilter={setFilter}
            assigneeList={[...new Set(tasks.map(t => t.assignee).filter(Boolean))]}
          />
        </div>
      )}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />
      <img
        src={image}
        alt="Cute Decoration"
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          width: 160,
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default TaskManager;
