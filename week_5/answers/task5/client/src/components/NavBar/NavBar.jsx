import { NavLink } from "react-router";

function NavBar() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        Task List
      </NavLink>
      <NavLink
        to="/add"
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        Add New Task
      </NavLink>
    </nav>
  );
}

export default NavBar;
