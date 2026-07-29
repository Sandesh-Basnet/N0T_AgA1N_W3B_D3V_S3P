import { TodoModel } from "../models/todoModel.js";

export const TodoService = {
  getAllTodos: () => TodoModel.getAll(),

  getTodoById: (id) => TodoModel.getById(id),

  createTodo: (data) => {
    return TodoModel.create({
      title: data.title,
      deadline: data.deadline,
      isUrgent: data.isUrgent,
    });
  },

  updateTodo: (id, data) => {
    const todo = TodoModel.getById(id);
    if (!todo) return null;

    if (data.title !== undefined) {
      todo.title = data.title.trim();
    }

    if (data.deadline !== undefined) {
      todo.deadline = data.deadline;
    }

    if (data.isUrgent !== undefined) {
      todo.isUrgent = data.isUrgent;
    }

    return todo;
  },

  deleteTodo: (id) => {
    const idx = TodoModel.findIndexById(id);
    if (idx === -1) return null;
    return TodoModel.deleteByIndex(idx);
  },
};
