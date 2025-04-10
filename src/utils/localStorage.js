// const STORAGE_KEY = "tasks_information";
const USERS_KEY = "jira_users";
const CURRENT_USER_KEY = "jira_current_user";

// 🔍 ดึงผู้ใช้ปัจจุบัน
export const getCurrentUser = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  };
  
  // 📥 โหลด tasks ของ user ปัจจุบัน
  export const loadTasks = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const current = getCurrentUser();
    return users[current]?.tasks || [];
  };
  
  // 💾 บันทึก tasks
  export const saveTasks = (tasks) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const current = getCurrentUser();
    if (current && users[current]) {
      users[current].tasks = tasks;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

// // โหลด tasks จาก localStorage
// export const loadTasks = () => {
//   try {
//     const data = localStorage.getItem(STORAGE_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("loadTasks error:", err);
//     return [];
//   }
// };

// // เซฟ tasks ลง localStorage
// export const saveTasks = (tasks) => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
//   } catch (err) {
//     console.error("saveTasks error:", err);
//   }
// };
