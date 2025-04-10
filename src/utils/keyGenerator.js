let counter = 1;

export const generateTaskKey = () => {
  const rand = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `TASK-${Date.now().toString().slice(-4)}${rand}${counter++}`;
};
