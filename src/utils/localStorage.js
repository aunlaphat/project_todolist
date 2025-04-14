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
