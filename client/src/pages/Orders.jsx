import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import "../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  const getCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.warn("Cart is empty");
      return;
    }

    setCheckoutLoading(true);
    try {
      const total = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      const orderData = {
        items: cart.map((item) => ({
          itemId: item._id,
          quantity: item.quantity,
        })),
        total,
      };

      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to place order");
      }

      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      console.error("Checkout Error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const incrementQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decrementQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    fetchOrders();
    getCart();
  }, []);

  return (
    <div className="container py-4 orders-wrapper">
      <div className="row">
        <div className="col-md-8">
          <h2>Your Orders</h2>
          {loading ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <p className="text-muted">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="card mb-3" key={order._id}>
                <div className="card-body">
                  <h5 className="card-title">Order #{order._id}</h5>
                  <p className="card-text">
                    <strong>Status:</strong> {order.status}
                    <br />
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <ul className="list-group list-group-flush">
                    {order.items.map((item, idx) => (
                      <li className="list-group-item" key={idx}>
                        {item.itemId?.name || "Unnamed Item"} (x{item.quantity}) = ₹
                        {(item.itemId?.price || 0) * item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-md-4">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p className="text-muted">No items in cart.</p>
          ) : (
            <ul className="list-group mb-3">
              {cart.map((item, idx) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-start"
                  key={idx}
                >
                  <div className="me-auto">
                    {item.name} (x{item.quantity})
                    <br />
                    <small>₹{item.price * item.quantity}</small>
                  </div>
                  <div className="btn-group btn-group-sm ms-2">
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      className="btn btn-outline-secondary"
                    >
                      +
                    </button>
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      className="btn btn-outline-secondary"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="btn btn-outline-danger"
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h5 className="mb-3">Total: ₹{cartTotal}</h5>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            className="btn btn-success w-100"
          >
            {checkoutLoading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
