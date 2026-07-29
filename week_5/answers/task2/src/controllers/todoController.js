import { TodoService } from "../services/todoService.js";

export const getAllTodos = (req, res) => {
  res.status(200).json(TodoService.getAllTodos());
};

export const getTodoById = (req, res) => {
  const todo = TodoService.getTodoById(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: "Todo item not found" });
  }

  res.status(200).json(todo);
};

export const createTodo = (req, res) => {
  const newTodo = TodoService.createTodo(req.body);
  res.status(201).json(newTodo);
};

export const updateTodo = (req, res) => {
  const updated = TodoService.updateTodo(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(updated);
};

export const deleteTodo = (req, res) => {
  const deleted = TodoService.deleteTodo(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Todo item not found" });
  }

  res.status(200).json({ message: "Todo deleted", todo: deleted });
};
