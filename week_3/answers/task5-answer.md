# Handling forms in React

## Step 1: Create the form component

- Create a folder named `Form` in the `src/components` folder
- Create `Form.jsx` and `Form.css` in the `Form` folder
- Add the following code to the `Form.css` file

  ```CSS
  form {
  text-align: left;
  width: 20%;
  margin: 0 auto;
  }

  input[type="text"],
  input[type="datetime-local"] {
  width: 100%;
  }

  form div {
  margin: 0.75rem 0;
  }
  ```

- In the `Form.jsx` file create a `Form` component
- Add input with label for `Title`, `Deadline` and `Is Urgent` along with a submit button
- Add client-side validation for the inputs
- Create states for `title`, `deadline` and `isUrgent`
- Bind the created states with their respective inputs
- Create an event listener to handle form submission
- Call `e.preventDefault()` in the form submission handler
- Add a `console.log` to print the values of the state

- Your `Form.jsx` file should look like this

```JSX
import { useState } from "react";
import "./Form.css";

function Form() {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      title,
      deadline,
      isUrgent,
    });
    alert("Form submitted");
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
            check={isUrgent}
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

## Step 2: Setup the form component in `App.jsx`

- Import the `Form` component in `App.jsx`
- Add the form component above the `<TaskContainer>`
- Test the application to see if the data from the form is printed in the browser console.

## Step 3: Setup a Page Header component with buttons to switch page

- Create a folder `PageHeader` in `src/components/`
- Create a `PageHeader.JSX` file and create a component accepting `currentPage` and `setCurrentPage` in the prop
- Add two button one to set the current page to `0` named `View Task List` and that sets the current page to `1` named, `Add New Task`
- Conditionally render these buttons, `View Task List` should only be shown when current page is `1` and `Add New Task` should only be shown when the current page is `0`

- Create a `PageHeader.css` file and add the following CSS

```CSS
#page-header {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
```

- Your `PageHeader.jsx` file should look something like this

```JSX
import "./PageHeader.css";

function PageHeader({ currentPage, setCurrentPage }) {
  return (
    <div id="page-header">
      {currentPage === 0 && (
        <button onClick={() => setCurrentPage(1)}>Add new task</button>
      )}
      {currentPage === 1 && (
        <button onClick={() => setCurrentPage(0)}>Show Task List</button>
      )}
    </div>
  );
}

export default PageHeader;
```

## Step 4: Add conditional rendering in the App.jsx

- Create a state `currentPage` in `App.jsx` and initialize it to 0
- Render `TaskContainer` when `currentPage===0` and render `Form` where `currentPage===1`
- Import and add the `PageHeader` component just below `h1` and pass the `currentPage` and its setter to `PageHeader` through props
- Your App.jsx should look similar to this

```JSX
import { useState } from "react";
import PageTitle from "./components/PageTitle/PageTitle";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Form from "./components/Form/Form";
import PageHeader from "./components/PageHeader/PageHeader";

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const containerTitle = "Tasks Due Today";
  const tasks = [
    { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    { time: "4:00 PM", text: "Go for a walk", isUrgent: true },
  ];

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

- Now test the application and try switching the pages using the buttons
