import { Link } from "react-router";

function TaskItem({ task, index }) {
  return (
    <li key={task.id}>
      <Link to={`/todo/${task.id}`}>
        {index + 1}. {task.title}
      </Link>
    </li>
  );
}

export default TaskItem;
