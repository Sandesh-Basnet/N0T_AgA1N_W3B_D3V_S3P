# Creating your first components

## Step 1: Project Setup

- Go to the folder where you want to create your react project
- Open the folder in the terminal and run the following command

```bash
npm create vite@latest todo-app -- --template react
```

- Select ESLint as your linter for the project
- Select Yes when asked if you want to install and run the project
- After this, a your project will be created with the template code in the `todo-list` folder and npm will install all the dependencies and run your project
- You can click the link to open the template project in your browser

## Step 2: Removing the default code

- Open the todo-list folder in VSCode
- Go to `src/` and delete the App.css file
- Remove all the code from the `App.jsx` file

## Step 3: Create your custom component and add it to the application

- In the `App.jsx` file create an empty component named App and set it as the default export from the file

```JSX
function App() {
  return (
    <>
    </>
  );
}

export default App;
```

- Create another component in the same file named `PageTitle`

```JSX
function PageTitle() {
  return (
    <>
      <h1>My Todo List Application</h1>
    </>
  );
}
```

- Now update the App Component to use this `PageTitle` Component

```JSX
function App() {
  return (
    <>
      <PageTitle/>
    </>
  );
}
```

- Now open the terminal in VSCode using `Ctrl+J` and run the application using the following command

```bash
npm run dev
```

- Follow the displayed link and check your site

## Step 3 : Extract the component into a separate file

- It is a bad practice in react to have two components in a single JSX file
- Create a `components` folder inside the `src` directory
- Create another folder inside the `components` folder named `PageTitle`
- Create the JSX and CSS file for the PageTitle Component, `PageTitle.jsx` and `PageTitle.css`
- Your folder should look something like the image below

![Folder Structure](sc_1.png)

- Copy the page title component from `App.jsx` into `PageTitle.jsx`
- Add `PageTitle` component as the default export from the `PageTitle.jsx` file
- Your `PageTitle.jsx` file should look similar to this

```JSX
function PageTitle() {
  return (
    <>
      <h1>My Todo List Application</h1>
    </>
  );
}

export default PageTitle;
```

## Step 4 : Using the new PageTitle component in App.jsx

- To use the `PageTitle` component in the `App.jsx` file you need to imoprt the `PageTitle` component
- As page title component is the default import, you can add the following code at the top of `App.jsx` file

```JSX
import PageTitle from "./components/PageTitle/PageTitle";
```

- Remove the old `PageTitle` component from the `App.jsx` file
- Your `App` component should now work

## Adding CSS to the PageTitle Component

- Add the following CSS code in the `PageTitle.css` file

```CSS
h1 {
  color: beige;
}
```

- Add an import from `PageTitle.css` to the top of `PageTitle.jsx`

```JSX
import "./PageTitle.css";
```

- Now open the terminal in VSCode using `Ctrl+J` and run the application using the following command

```bash
npm run dev
```

## Final Code

**src/components/PageTitle/PageTitle.jsx**

```jsx
import "./PageTitle.css";

function PageTitle() {
  return (
    <>
      <h1>My Todo List Application</h1>
    </>
  );
}

export default PageTitle;
```

**src/components/PageTitle/PageTitle.css**

```css
h1 {
  color: beige;
}
```

**src/App.jsx**

```JSX
import PageTitle from "./components/PageTitle/PageTitle";

function App() {
  return (
    <>
      <PageTitle />
    </>
  );
}

export default App;
```
