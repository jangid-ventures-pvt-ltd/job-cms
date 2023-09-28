const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const checkAdmin = require('../middleware/checkRole')('admin');
const checkModerator = require('../middleware/checkRole')('moderator');

// Create a new category
router.post('/admin', checkAdmin, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/moderator', checkModerator, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific category by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/moderator/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category by ID
router.put('/admin/:id', checkAdmin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/moderator/:id', checkModerator, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a category by ID
router.delete('/admin/:id', checkAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;