import { Router } from 'express';
import Item from '../models/item.js'; // Import the model
import auth from '../middleware/auth.js';

const router = Router();

// Get all items or by category (optional query param)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const items = await Item.find(filter); // Use Item.find() method
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get items by category from URL param
router.get('/category/:category', async (req, res) => {
  const slugToCategory = {
    'starter': 'starter',
    'main-course': 'main course',
    'beverage': 'beverage',
    'dessert': 'dessert',
  };

  const category = slugToCategory[req.params.category];

  if (!category) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const items = await Item.find({ category });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items by category' });
  }
});

// Add new item (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const item = await Item.create(req.body); // Use Item.create() method
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to add item' });
  }
});

// Update item by ID (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update item' });
  }
});

// Delete item by ID (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const deleted = await Item.findByIdAndDelete(req.params.id); // Use Item.findByIdAndDelete() method
    if (!deleted) return res.status(404).json({ error: 'Item not found' });

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
