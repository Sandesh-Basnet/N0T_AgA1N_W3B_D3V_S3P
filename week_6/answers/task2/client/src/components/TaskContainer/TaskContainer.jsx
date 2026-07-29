import { useState, useEffect } from "react";
import TaskItem from "../TaskItem/TaskItem";
import { getTasks } from "../../services/TaskService";
import { useAuth } from "../../context/AuthContext";

function TaskContainer({ containerTitle }) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      let savedTasks = await getTasks(token);
      setTasks(savedTasks);
      setIsLoading(false);
    };
    setIsLoading(true);
    loadTasks();
  }, [token]);

  const toggleUrgentFilter = () => {
    setFilterUrgent((prev) => !prev);
  };

  let filteredTasks = tasks;

  if (filterUrgent) {
    filteredTasks = tasks.filter((x) => x.isUrgent);
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (tasks.length === 0) {
    return <h2>No Pending Tasks</h2>;
  } else {
    return (
      <>
        <h2>{containerTitle}</h2>
        <div>
          <span>
            <input
              type="checkbox"
              checked={filterUrgent}
              id="urgent-filter"
              onChange={toggleUrgentFilter}
            />
            <label htmlFor="urgent-filter">Filter Urgent</label>
          </span>
        </div>
        <ul>
          {filteredTasks.map((task, index) => (
            <TaskItem task={task} index={index} />
          ))}
        </ul>
      </>
    );
  }
}

export default TaskContainer;
