import { motion } from "framer-motion";
import PropTypes from "prop-types";
import "../styles/ItemCard.css";

export default function ItemCard({ item, onAddToCart }) {
  const { name, price, image } = item;
  const defaultImage = "/path/to/default-image.jpg"; // Replace with real default image path

  return (
    <motion.div
      className="item-card-modern"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={image || defaultImage}
        alt={name}
        className="item-card-img-modern"
      />
      <div className="item-card-body-modern">
        <h5 className="item-card-title-modern">{name}</h5>
        <p className="item-card-price-modern">₹{price.toFixed(2)}</p>
        <button className="item-card-btn-modern" onClick={() => onAddToCart(item)}>
          Add +
        </button>
      </div>
    </motion.div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};
