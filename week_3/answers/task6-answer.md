# Handling Effects in React

# Step 1 : Install localforage library

- `localforage` is a npm package, that allows us to store data locally in the browser
- install the package by running the following command in the terminal

```bash
npm install localforage
```

# Step 2: Add a `TaskService.js` file

- Create `services` folder inside the `src/` directory
- Create a `TaskService.js` in the services folder
- In the `TaskService.js` folder, create function to add and view all tasks from local forage

- Your `TaskService.js` should look something similar to this

```JS
import localforage from "localforage";

const taskListKey = "taskList";

export async function getTasks() {
  debugger;
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
```

## Step 3: Add a useEffect hook in App.jsx to load tasks using TaskService.js instead of localArray

- Add import for `useEffect`
- Call the `useEffect` hook with with a callback and an empty dependency array

```JSX
  useEffect(() => {

  }, []);
```

- Create a state to store `tasks`

```JSX
const [tasks, setTasks] = useState([]);
```

- Import the `getTasks` function from the `TaskService.js` file

- Create a `async function` inside the useEffect callback and assign it to a variable named `loadTask`

- Inside the `loadTask` function, `await` the `getTasks` function call and set the task state to the returned value

- Called the loadTasks function inside the `useEffect` callback to load task

```JSX
useEffect(() => {
    const loadTasks = async () => {
        let savedTasks = await getTasks();
        setTasks(savedTasks);
    };

    loadTasks();
}, []);
```

- Remove the `tasks` array variable

- Your `App.jsx` should look something similar to this

```JSX
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

    loadTasks();
  }, []);

  return (
    <>
      <PageTitle />
      <PageHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 1 && <Form />}
      {currentPage === 0 && (
        <TaskContainer containerTitle={containerTitle} tasks={tasks} />
      )}
    </>
  );
}

export default App;
```

## Step 4: Change the form component to save the task using `TaskService.js`

- Go to the `Form.jsx` file and import the `createTask` function from the `TaskService.js` file

- Find the `handleSubmit` function and call the `createTask` function

- Add a prop for `setCurrentPage`

- Add a call to `setCurrentPage` to 0 after form submission

- Pass the prop `setCurrentPage` from `App` to `Form`

```JSX
<Form setCurrentPage={setCurrentPage} />
```

- Your `Form` component should look something like this

```JSX
import { useState } from "react";
import { createTask } from "../../services/TaskService";
import "./Form.css";

function Form({ setCurrentPage }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(title, deadline, isUrgent);
    setCurrentPage(0);
    alert("Task Saved Successfully");
  };

  return (
    <>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deadline</label>
          <br />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />
          <label>Is Urgent</label>
        </div>
        <button>Submit</button>
      </form>
    </>
  );
}

export default Form;
```

- Test your app and see, if new tasks appears in your application after form submission

- Spoiler! It doesnot. It should show data only after you reload the page

## Step 5: Add currentPage to useEffect dependency list

- As the Form component updates the currentPage after successfull form submission we can use this to trigger useEffect callback

- Add the `currentPage` in the dependency list

- In the useEffect callback, check if the `currentPage` is 0, if so then call `loadTasks`

```JSX
useEffect(() => {
    const loadTasks = async () => {
        let savedTasks = await getTasks();
        setTasks(savedTasks);
    };
    if (currentPage === 0) {
        loadTasks();
    }
}, [currentPage]);
```

- Check your application to see if everything is working properly now
