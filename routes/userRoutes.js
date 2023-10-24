const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const checkAdmin = require('../middleware/checkRole')('admin');

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await User.findOne({ username, role: 'admin' });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with the role included in the payload
    const token = jwt.sign({ _id: admin._id, role: admin.role, username: admin.username }, config.jwtSecret);

    // Update the user's token with the new one
    admin.token = token;

    // Save the user with the new token
    await admin.save();

    // Include the user's role and username in the response
    res.status(200).json({ message: 'Admin login successful', token, username: admin.username, role: admin.role});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//moderator login
router.post('/moderator/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const moderator = await User.findOne({ username, role: 'moderator' });

    if (!moderator) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, moderator.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a new JWT token
    const token = jwt.sign({ _id: moderator._id, role: moderator.role, username: moderator.username }, config.jwtSecret);

    // Store the token in the user's document
    moderator.token = token;

    // Save the user with the new token
    await moderator.save();

    // Include the user's role and username in the response
    res.status(200).json({ message: 'moderator login successful', token, username: moderator.username, role: moderator.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new moderator user (accessible only to admins)
router.post('/admin/moderators', checkAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate that the username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new moderator user with the 'moderator' role
    const newModerator = new User({
      username,
      password: hashedPassword,
      role: 'moderator',
    });

    // Save the new moderator user to the database
    const savedModerator = await newModerator.save();

    res.status(201).json(savedModerator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all moderator users (accessible only to admins)
router.get('/admin/moderators', checkAdmin, async (req, res) => {
  try {
    // Fetch and return a list of all moderator users
    const moderators = await User.find({ role: 'moderator' });
    res.status(200).json(moderators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single moderator user (accessible only to admins)
router.get('/admin/moderators/:id', checkAdmin, async (req, res) => {
  try {
    // Fetch and return a single moderator user by ID
    const moderator = await User.findById(req.params.id);

    if (!moderator) {
      return res.status(404).json({ error: 'Moderator user not found' });
    }

    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a moderator user by ID (accessible only to admins)
router.put('/admin/moderators/:id', checkAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate that the username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the moderator user by ID
    const updatedModerator = await User.findByIdAndUpdate(
      req.params.id,
      { username, password: hashedPassword },
      { new: true }
    );

    if (!updatedModerator) {
      return res.status(404).json({ error: 'Moderator user not found' });
    }

    res.status(200).json(updatedModerator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a moderator user by ID (accessible only to admins)
router.delete('/admin/moderators/:id', checkAdmin, async (req, res) => {
  try {
    // Delete the moderator user by ID
    const deletedModerator = await User.findByIdAndRemove(req.params.id);

    if (!deletedModerator) {
      return res.status(404).json({ error: 'Moderator user not found' });
    }

    res.status(200).json(deletedModerator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;