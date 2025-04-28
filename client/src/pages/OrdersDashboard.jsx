import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/ordersDashboard.css";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders for admin
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update for orders
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/update/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        toast.success(`Order marked as ${status}`, { autoClose: 2000 });
        fetchOrders(); // Refresh orders after status change
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong while updating status.");
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Order deleted successfully!", { autoClose: 2000 });
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Something went wrong while deleting order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container-fluid px-3 px-md-5 py-4">
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/admin")}
      >
        ← Back to Admin
      </button>
      <h2 className="mb-4">Manage Orders</h2>

      <div className="row g-4">
        {orders.map((order) => {
          // Calculate order total
          const orderTotal = order.items.reduce(
            (sum, item) =>
              sum + (item.itemId?.price || 0) * (item.quantity || 1),
            0
          );

          return (
            <div key={order._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm p-3 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title mb-3">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h5>
                  <p className="mb-2">
                    <strong>Customer:</strong> {order?.userId?.name || "Guest"}
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span className={`status-label ${order.status}`}>
                      {order.status}
                    </span>
                  </p>
                  <p className="mb-3">
                    <strong>Total:</strong> ₹{orderTotal}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="status-buttons mb-3">
                    <button
                      onClick={() => handleUpdateStatus(order._id, "pending")}
                      disabled={order.status === "pending"}
                      className="btn btn-primary btn-sm me-1 mb-2"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, "preparing")}
                      disabled={order.status === "preparing"}
                      className="btn btn-warning btn-sm me-1 mb-2"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                      disabled={order.status === "delivered"}
                      className="btn btn-success btn-sm mb-2"
                    >
                      Completed
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="btn delete-btn w-100"
                  >
                    Delete Order
                  </button>

                  <div className="mt-3">
                    <h6 className="fw-semibold mb-2">Items:</h6>
                    <ul className="list-unstyled mb-0">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.itemId
                            ? `${item.itemId.name} (x${item.quantity}) — ₹${
                                (item.itemId.price || 0) * item.quantity
                              }`
                            : "Item not found"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
