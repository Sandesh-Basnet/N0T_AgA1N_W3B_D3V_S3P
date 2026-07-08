import localforage from "localforage";

const taskListKey = "taskList";

export async function getTasks() {
  let taskList = await localforage.getItem(taskListKey);
  return taskList ?? [];
}

export async function createTask(title, deadline, isUrgent) {
  let taskObj = {
    text: title,
    time: deadline,
    isUrgent,
  };
  let taskList = await localforage.getItem(taskListKey);
  taskList = taskList ?? [];
  taskList = [taskObj, ...taskList];
  await localforage.setItem(taskListKey, taskList);
}
