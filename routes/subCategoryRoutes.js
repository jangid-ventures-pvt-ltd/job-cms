const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const checkAdmin = require('../middleware/checkRole')('admin');
const checkModerator = require('../middleware/checkRole')('moderator');

// Create a new SubCategory
router.post('/admin', checkAdmin, async (req, res) => {
  try {
    const newSubCategory = new SubCategory(req.body);
    const savedSubCategory = await newSubCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/moderator', checkModerator, async (req, res) => {
  try {
    const newSubCategory = new SubCategory(req.body);
    const savedSubCategory = await newSubCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific subcategory by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/moderator/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a subcategory by ID
router.put('/admin/:id', checkAdmin, async (req, res) => {
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(updatedSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/moderator/:id', checkModerator, async (req, res) => {
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(updatedSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Subcategory by ID
router.delete('/admin/:id', checkAdmin, async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndRemove(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(200).json(deletedSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;