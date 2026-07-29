# State and interactivity

## Step 1: Add a checkbox input in `TaskContainer.jsx` to filter only urgent tasks

- In the `TaskContainer` component add a checkbox input below the `h2` tag

```JSX
<div>
    <input type="checkbox" checked={false} id="urgent-filter" />
    <label htmlFor="urgent-filter">Filter Urgent</label>
</div>
```

## Step 2: Add state to control weather to filter or not

- Add an import to `useState` in `TaskContainer.jsx`

```JSX
import { useState } from "react";
```

- Add a state using `useState` hook to control weather to filter only urgent or not

- Initialize the state to `false`

```JSX
const [filterUrgent, setFilterUrgent] = useState(false);
```

## Step 3: Add event listener to change the value of state when user checks/unchecks

- Add a function named `toggleUrgentFilter` in `TaskContainer` component

- In the function call `setFilterUrgent` function to toggle the value i.e. if true should set false, if false set true.

```JSX
const toggleUrgentFilter = () => {
  // This sets the state opposite to the previous value
  setFilterUrgent((prev) => !prev);
};
```

- Set the `onChange` prop of the checkbox input to `toggleUrgentFilter`

```JSX
<input
    type="checkbox"
    checked={false}
    id="urgent-filter"
    onChange={toggleUrgentFilter}
/>
```

- Connect the value of the `filterUrgent` state with the checkbox input `checked` prop

```JSX
<input
    type="checkbox"
    checked={filterUrgent}
    id="urgent-filter"
    onChange={toggleFilter}
/>
```

- Check to see if the checkbox works properly

## Step 4: Use the state to filter the tasks

- Use `array.filter()` function to filter the tasks when `filterUrgent` state is `true`/`checked` and stored the new array in a `filteredTasks` variable

```JSX
// Filtered tasks is set to all the tasks
let filteredTasks = tasks;

// If filterUrgenet state is true then filteredTasks contains only tasks with isUrgent true
if (filterUrgent) {
    filteredTasks = tasks.filter((x) => x.isUrgent);
}
```

- Instead of using `tasks` to render the UI, use the new `filteredTasks` array

- Test the app, it should now filter the tasks when the checkbox is checked

## Final code for TaskContainer.jsx

```JSX
import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskContainer.css";

function TaskContainer({ containerTitle, tasks }) {
  const [filterUrgent, setFilterUrgent] = useState(false);
  const toggleUrgentFilter = () => {
    // This sets the state opposite to the previous value
    setFilterUrgent((prev) => !prev);
  };

  // Filtered tasks is set to all the tasks
  let filteredTasks = tasks;

  // If filterUrgenet state is true then filteredTasks contains only tasks with isUrgent true
  if (filterUrgent) {
    filteredTasks = tasks.filter((x) => x.isUrgent);
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
```
