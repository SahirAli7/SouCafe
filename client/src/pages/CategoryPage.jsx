import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import '../styles/category.css'

export default function CategoryPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const prettyCategory = category
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/items/category/${category}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        toast.error("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  const handleAddToCart = (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in first to order.');
      return;
    }

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      cart = [];
    }

    const index = cart.findIndex(cartItem => cartItem._id === item._id);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div
      style={{
        padding: "50px 20px",
        backgroundColor: "#f5f5f5",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.h2
          className="text-center fw-bold mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "3rem", 
            fontWeight: "700", 
            textAlign: "center",
            color: "#2c3e50", 
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", 
          }}
        >
          | {prettyCategory}
        </motion.h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-light" role="status" aria-label="Loading"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="empty-msg">No items available in this category.</p>
        ) : (
          <motion.div
            className="d-flex flex-wrap justify-content-center"
            style={{ gap: "30px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {items.map(item => (
              <div key={item._id} style={{ flex: "1 1 300px", maxWidth: "300px" }}>
                <ItemCard item={item} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
