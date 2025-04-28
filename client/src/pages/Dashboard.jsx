import AdminSidebar from "../components/AdminSidebar";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Use the panel below to manage items and orders.</p>
      </div>
      <div className="d-flex justify-content-center">
        <AdminSidebar />
      </div>
    </div>
  );
}
