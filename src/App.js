import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Input, Select, message } from "antd";
import { PlusOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { loadTasks, saveTasks } from "./utils/localStorage";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import TaskTable from "./components/TaskTable";
import TaskModal from "./components/TaskModal";
import TaskDetail from "./components/TaskDetail";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { generateTaskKey } from "./utils/keyGenerator";


const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function TaskManager() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const location = useLocation();

  useEffect(() => {
    const data = loadTasks();
    setTasks(data);
  }, [location.pathname]); // โหลดใหม่เมื่อเปลี่ยนหน้า

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
      const updateTaskTree = (list) =>
        list.map(t => {
          if (t.key === newKey) return newTask;
          if (t.children) return { ...t, children: updateTaskTree(t.children) };
          return t;
        });
      setTasks(updateTaskTree(tasks));
    } else if (task.parentId) {
      const addSubtask = (list) =>
        list.map(t => {
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
  
  

  const handleDelete = (key) => {
    const removeTask = (list) =>
      list
        .filter(t => t.key !== key)
        .map(t =>
          t.children
            ? { ...t, children: removeTask(t.children) }
            : t
        );
    setTasks(removeTask(tasks));
  };

  const handleStatusChange = (key, checked) => {
    const update = (list) =>
      list.map(task => {
        if (task.key === key) {
          return {
            ...task,
            status: checked ? "DONE" : "TO DO",
            updatedAt: new Date(),
          };
        }
        if (task.children) {
          return { ...task, children: update(task.children) };
        }
        return task;
      });
    setTasks(update(tasks));
  };

  const handleInlineUpdate = (key, field, value) => {
    const update = (list) =>
      list.map(task => {
        if (task.key === key) {
          return {
            ...task,
            [field]: value,
            updatedAt: new Date(),
          };
        }
        if (task.children) {
          return { ...task, children: update(task.children) };
        }
        return task;
      });

    setTasks(update(tasks));
  };

  const filteredTasks = tasks
    .filter(task =>
      task.key?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const dA = new Date(a.createdAt);
      const dB = new Date(b.createdAt);
      return sortOrder === "desc" ? dB - dA : dA - dB;
    });

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Header style={{ backgroundColor: "#001529", padding: "1rem" }}>
        <Title level={3} style={{ color: "white", marginBottom: 0 }}>
          ✅ Jira-style ToDo Tree
        </Title>
      </Header> */}
      <Content style={{ padding: "2rem" }}>
        <Input.Search
          placeholder="ค้นหาโดย key หรือ summary"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />

        <Select
          value={sortOrder}
          onChange={setSortOrder}
          style={{ width: 200, marginLeft: 16 }}
        >
          <Option value="desc">ล่าสุด → เก่าสุด</Option>
          <Option value="asc">เก่าสุด → ล่าสุด</Option>
        </Select>

        <Button
  icon={<DownloadOutlined />}
  style={{ marginRight: 8 }}
  onClick={() => handleExport()}
>
  Export JSON
</Button>

<Button
  icon={<UploadOutlined />}
  onClick={() => document.getElementById("import-file").click()}
>
  Import JSON
</Button>

<input
  type="file"
  id="import-file"
  accept="application/json"
  style={{ display: "none" }}
  onChange={handleImport}
/>


        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ float: "right" }}
          onClick={handleAdd}
        >
          เพิ่ม Task
        </Button>

        <TaskTable
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onInlineUpdate={handleInlineUpdate}
          onOpenDetail={(key) => navigate(`/task/${key}`)}
        />

        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingTask}
        />
      </Content>
    </Layout>
  );
}

export default function App() {
  const currentUser = localStorage.getItem("jira_current_user");
  return (
    <Router>
      {currentUser && <Navbar />}
      <Routes>
        {/* ✅ ถ้าไม่ได้ login → ไปหน้า login */}
        {!currentUser && <Route path="*" element={<Navigate to="/login" replace />} />}
        
        {/* ✅ หน้า login */}
        <Route path="/login" element={<Login />} />

        {/* ✅ หน้า Task หลัก */}
        <Route path="/my-task" element={<TaskManager />} />

        {/* ✅ หน้า Task รายละเอียด */}
        <Route path="/information-task/:key" element={<TaskDetail />} />

        {/* ✅ Redirect root ไป /my-task (หลัง login แล้ว) */}
        {currentUser && <Route path="/" element={<Navigate to="/my-task" replace />} />}
      </Routes>
    </Router>
  );
}
