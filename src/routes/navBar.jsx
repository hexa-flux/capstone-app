import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="navbar">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav_link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/addevent" className="nav_link">
              Add Event
            </Link>
          </li>
          <li>
            <Link to="/help" className="nav_link">
              Help
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
