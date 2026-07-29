import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav>
      <NavLink
        className={({ isActive }) => (isActive ? "active-link" : "")}
        to={"/"}
      >
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active-link" : "")}
        to={"/todo/add"}
      >
        Add To-Do Item
      </NavLink>
      {user && (
        <>
          <span>Welcome, {user.fullName}</span>
          <button onClick={handleLogout}>Log Out</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
