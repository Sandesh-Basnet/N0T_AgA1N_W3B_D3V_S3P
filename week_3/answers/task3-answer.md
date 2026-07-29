# Passing data with props in React

## Step 1: Passing the title and list of tasks into `TaskContainer`

- Add an `containerTitle` and `tasks` props in the `TaskContainer` component

```JSX
function TaskContainer({ title, tasks })
```

- In the `App.jsx` paste the `containerTitle` and `tasks` variable from the `TaskContainer` component

- Remove the `containerTitle` and `tasks` variable from the `TaskContainer` component

```JSX
function App() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: true },
  ];
  ...
}
```

- In JSX expression of App.jsx file, pass the task title and tasks variables in the props to the `TaskContainer` component

```JSX
<TaskContainer containerTitle={containerTitle} tasks={tasks} />
```

- Run the application and check if it is working properly

## Step 2: Create a TodoList Item component and pass data to it through props

- Create a folder in `src/components` named `TaskItem`

- Create `TaskItem.css` and `TaskItem.jsx`, in the folder

- Create a `TaskItem` component and copy the `li` element from the `TaskContainer` into the `TaskItem` component

- Add a `task` and `title` prop to the `TaskItem` component

- Your code should look something like this

```JSX
import "./TaskItem.css";

function TaskItem({ task, index }) {
  return (
    <li
      className={task.isUrgent ? "task-item urgent-task" : "task-item"}
      key={index}
    >
      <span>{task.time}</span>-<span>{task.text}</span>
    </li>
  );
}

export default TaskItem;
```

- Import the `TaskItem` compnent into `TaskContainer` component

- Render the `TaskItem` using the array instead of the `li` element

- Pass the value for the props `task` and `index`

- Your `TaskContainer` component should look something like this:

```JSX
import TaskItem from "../TaskItem/TaskItem";
import "./TaskContainer.css";

function TaskContainer({ containerTitle, tasks }) {
  if (tasks.length === 0) {
    return <h2>No Pending Tasks</h2>;
  } else {
    return (
      <>
        <h2>{containerTitle}</h2>
        <ul>
          {tasks.map((task, index) => (
            <TaskItem task={task} index={index} />
          ))}
        </ul>
      </>
    );
  }
}

export default TaskContainer;
```

- Test your application to see if everything is working correctly
