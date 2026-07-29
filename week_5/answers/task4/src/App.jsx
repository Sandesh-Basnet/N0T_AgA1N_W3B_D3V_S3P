import { BrowserRouter, Routes, Route } from "react-router";
import PageTitle from "./components/PageTitle/PageTitle";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import AddTodo from "./pages/AddTodo";
import TodoItem from "./pages/TodoItem";

function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTodo />} />
        <Route path="/task/:id" element={<TodoItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
