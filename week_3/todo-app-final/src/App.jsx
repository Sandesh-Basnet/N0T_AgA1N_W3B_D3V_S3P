import { useState, useEffect } from "react";
import PageTitle from "./components/PageTitle/PageTitle";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Form from "./components/Form/Form";
import PageHeader from "./components/PageHeader/PageHeader";
import { getTasks } from "./services/TaskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const containerTitle = "Tasks Due Today";

  useEffect(() => {
    const loadTasks = async () => {
      let savedTasks = await getTasks();
      setTasks(savedTasks);
    };
    if (currentPage === 0) {
      loadTasks();
    }
  }, [currentPage]);

  return (
    <>
      <PageTitle />
      <PageHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 1 && <Form setCurrentPage={setCurrentPage} />}
      {currentPage === 0 && (
        <TaskContainer containerTitle={containerTitle} tasks={tasks} />
      )}
    </>
  );
}

export default App;
