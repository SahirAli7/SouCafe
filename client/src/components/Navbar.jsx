import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext"; // ✅ Import context
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext); // ✅ Use shared state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed Out!");
    navigate("/")
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <h3 className="text-white m-0">SOU Cafe</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category/starter">
                Starter
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category/main-course">
                Main Course
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category/beverage">
                Beverage
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category/dessert">
                Dessert
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="d-flex">
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-outline-light">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline-light">
              Signout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
