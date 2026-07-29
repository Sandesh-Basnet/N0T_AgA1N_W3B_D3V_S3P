# Building your ToDo List

## Objectives:

- Learn how to use JS code in JSX
- Rendering Lists
- Applying CSS in JSX using className
- Conditional Rendering

## Step 1: Creating the required files

- Coninue from the previous task
- In the `src\components\` folder create a `TaskContainer.jsx` and `TaskContainer.css` file

- Add the following code in the `TaskContainer.jsx` file

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  return (
    <>
      <h2>Tasks Due Today</h2>
      <ul>
        <li>
          <span>9:00 AM</span>-<span>Get eggs in 5 mins</span>
        </li>
        <li>
          <span>9:05 AM</span>-<span>Forget to get eggs</span>
        </li>
        <li>
          <span>10:00 AM</span>-<span>Get scolded by mom</span>
        </li>
        <li>
          <span>10:05 AM</span>-<span>Argue with mom</span>
        </li>
        <li>
          <span>10:10 AM</span>-<span>Tend to your chappal bruise on face</span>
        </li>
      </ul>
    </>
  );
}

export default TaskContainer;
```

- Import `TaskContainer` component in `App.jsx` and add the `TaskContainer` component inside the `App.jsx` component

```JSX
import PageTitle from "./components/PageTitle/PageTitle";
import TaskContainer from "./components/TaskContainer/TaskContainer";
function App() {
  return (
    <>
      <PageTitle />
      <TaskContainer />
    </>
  );
}

export default App;
```

- Run `npm run dev` in the terminal to run the application

## Step 2: Render a JS variable in JSX

- In the `TaskContainer` component create a constant variable `containerTitle`

```JSX
const containerTitle = "Tasks Due Today";
```

- Render this variable in the Component using curly braces `{}` in the `h2` tag

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  const containerTitle = "Tasks Due Today";
  return (
    <>
      <h2>{containerTitle}</h2>
      ...
    </>
  );
}

export default TaskContainer;

```

- Check if the UI is rendered properly

## Step 3 : Refractor the TaskList container to render a local array of task

- Create an array of tasks objects in the `TaskContainer` component

```JSX
const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: false },
  ];
```

- Use the `.map()` function of array to map the array for task into JSX. Notice how the map function is returning a list of JSX elements that are rendered into the UI
- For each, list item use the `key` attribute. Using `key` attribute is critical when rendering any kinds of list in react. This `key` is used by react when rendering the virtual dom, missing key leads to servere bugs.

- The `TaskContainer` should look similar to the code below

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: false },
  ];

  return (
    <>
      <h2>{containerTitle}</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task.time}</span>-<span>{task.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskContainer;
```

## Step 4: Apply inline CSS to the list items

- Use an `style` attribute to the li tag
- Set the `list-style` css property to none in the inline CSS.

```JSX
<li style={{ listStyle: "none" }} key={index}>
```

- Check the application and see if the bullet points disappear

- Add some other CSS rules, for example:
  - Increase font-weight
  - Increase font-size
  - Change font color etc

```JSX
<li style={{ listStyle: "none", color: "whitesmoke", fontSize: "1rem" }} key={index}>
```

- Notice, the style value is just a JS object, refractor the object into a listItemStyle variable
- Your final code should look like this

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: false },
  ];

  const listItemStyle = {
    listStyle: "none",
    color: "whitesmoke",
    fontSize: "1rem",
  };

  return (
    <>
      <h2>{containerTitle}</h2>
      <ul>
        {tasks.map((task, index) => (
          <li style={listItemStyle} key={index}>
            <span>{task.time}</span>-<span>{task.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskContainer;
```

## Step 5: Using class to apply CSS

- Remove the `listItemStyle` variable and `style` attribute from the `li` item
- Add a `className` attribute to the `li` item and set the value to `"task-item"`

```JSX
<li className="task-item" key={index}>
```

- Add the CSS selector and move the CSS rules for the list item in the `TaskContainer.css` file

```CSS
.task-item {
  list-style: none;
}
```

- Run and check if the application is running correctly

- Add a CSS rule to target all element of `urgent-task` class in the `TaskContainer.css` file

```CSS
.urgent-task {
  color: #d32f2f;
  font-weight: bold;
}
```

- Update the JSX to add the `urgent-task` class to the tasks with `isUrgent` property set to `true`
- Check if urgent tasks appear red
- Your final code should look similar to below

**src/components/TaskContainer.css**

```CSS
.task-item {
  list-style: none;
}

.urgent-task {
  color: #d32f2f;
  font-weight: bold;
}
```

**src/components/TaskContainer.jsx**

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: true },
  ];

  return (
    <>
      <h2>{containerTitle}</h2>
      <ul>
        {tasks.map((task, index) => (
          <li
            className={task.isUrgent ? "task-item urgent-task" : "task-item"}
            key={index}
          >
            <span>{task.time}</span>-<span>{task.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskContainer;
```

## Step 6: Conditional rendering

- Add an if/else condition to check if the task list is empty inside the `TaskContainer` component

- If the task list is empty it should return a `h2` saying "No Pending Task"

- Else it should return the previous code

- Your code should look something like this

- Comment out all the tasks in the task list and check if the app is working correctly

```JSX
import "./TaskContainer.css";

function TaskContainer() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: false },
  ];

  if (tasks.length === 0) {
    return <h2>No Pending Tasks</h2>;
  } else {
    return (
      <>
        <h2>{containerTitle}</h2>
        <ul>
          {tasks.map((task, index) => (
            <li
              className={task.isUrgent ? "task-item urgent-task" : "task-item"}
              key={index}
            >
              <span>{task.time}</span>-<span>{task.text}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default TaskContainer;
```
