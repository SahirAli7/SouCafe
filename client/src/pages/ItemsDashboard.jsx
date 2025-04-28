import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/itemsDashboard.css";

export default function ItemsDashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
      toast.error("All fields are required!");
      return;
    }
    if (isNaN(newItem.price) || newItem.price <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        toast.success("Item added!");
        setNewItem({ name: "", price: "", category: "", image: "" });
        fetchItems();
      } else {
        toast.error("Failed to add item.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        toast.success("Deleted!");
        fetchItems();
      } else {
        toast.error("Delete failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({ ...item });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editData.name || !editData.price || !editData.category || !editData.image) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/api/items/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        toast.success("Updated!");
        setEditingId(null);
        fetchItems();
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="container-fluid px-3 px-md-5 py-4">
      <button className="btn btn-primary mb-3" onClick={() => navigate("/admin")}>
        ← Back to Admin
      </button>
      <h2 className="mb-4">Items</h2>

      <ul className="nav nav-pills mb-4">
        {categories.map((cat) => (
          <li className="nav-item" key={cat}>
            <button
              className={`nav-link ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <form className="row g-3 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <input
            className="form-control"
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <select
            className="form-select"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <option value="">Select category</option>
            <option value="starter">Starter</option>
            <option value="main course">Main Course</option>
            <option value="beverage">Beverage</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <input
            className="form-control"
            type="text"
            placeholder="Image URL"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
          />
        </div>
        <div className="col-12">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleAdd}
          >
            Add Item
          </button>
        </div>
      </form>

      <div className="row g-4">
        {filtered.map((item) => (
          <div key={item._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            {editingId === item._id ? (
              <div className="card h-100 shadow-sm p-3">
                <div className="card-body">
                  <input
                    className="form-control mb-2"
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                  />
                  <select
                    className="form-select mb-2"
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  >
                    <option value="starter">Starter</option>
                    <option value="main course">Main Course</option>
                    <option value="beverage">Beverage</option>
                    <option value="dessert">Dessert</option>
                  </select>
                  <input
                    className="form-control mb-2"
                    type="text"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  />
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card h-100 shadow-sm">
                <img
                  src={item.image}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "180px" }}
                  alt={item.name}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    ₹{item.price.toFixed(2)}
                  </p>
                  <div className="d-flex justify-content-between mt-auto">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted">No items in this category.</p>
        )}
      </div>
    </div>
  );
}
