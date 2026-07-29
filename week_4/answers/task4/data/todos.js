export const todos = [
  { id: 1, title: "Buy groceries", deadline: "2026-07-12", isUrgent: false },
  {
    id: 2,
    title: "Finish project report",
    deadline: "2026-07-11",
    isUrgent: true,
  },
];

export let nextId = 3;

export function incrementNextId() {
  nextId++;
}
