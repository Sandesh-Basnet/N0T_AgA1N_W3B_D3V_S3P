import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getTaskById } from "../services/TaskService";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const loadTask = async () => {
      let foundTask = await getTaskById(id);
      setTask(foundTask);
    };

    loadTask();
  }, [id]);

  if (!task) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>{task.text}</h2>
      <p>Deadline: {task.time}</p>
      <p>{task.isUrgent ? "Urgent" : "Not Urgent"}</p>
    </div>
  );
}

export default TaskDetail;
