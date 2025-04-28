import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="bg-light min-vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center text-center py-5">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="display-4 fw-bold mb-3 text-dark"
        >
          Welcome to SOU Cafe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lead text-secondary"
        >
          Explore our delicious menu and exciting offers!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4"
        >
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="Cafe"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '500px' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
