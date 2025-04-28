import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { AuthContext } from "../context/authContext";
import "../styles/sidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated, isAdmin } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="text-center my-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="bg-light border rounded-4 p-4 shadow-sm w-100"
      style={{ maxWidth: "400px" }}
    >
      <h4 className="mb-4 text-center text-dark">Admin Panel</h4>
      <ul className="list-unstyled mb-4">
        <li className="mb-3">
          <Link
            className="d-block px-3 py-3 rounded text-dark fw-medium bg-white border shadow-sm text-decoration-none admin-link"
            to="/admin/items"
          >
            Manage Items
          </Link>
        </li>
        <li className="mb-3">
          <Link
            className="d-block px-3 py-3 rounded text-dark fw-medium bg-white border shadow-sm text-decoration-none admin-link"
            to="/admin/orders"
          >
            Manage Orders
          </Link>
        </li>
      </ul>
      <button
        className="btn btn-outline-danger w-100 fw-medium"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
