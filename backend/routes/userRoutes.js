const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /api/users - Create new user (donor)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const newUser = new User({ name, email, phone, address });
    await newUser.save();

    res.status(201).json({ 
      message: 'User submitted for admin approval',
      user: newUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users/pending - Pending users (admin)
router.get('/pending', async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/:id/approve - Approve user
router.patch('/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'approved';
    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/:id/reject - Reject user
router.patch('/:id/reject', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isApproved) {
      return res.status(400).json({ message: 'Already approved' });
    }

    user.status = 'rejected';
    user.isApproved = false;
    await user.save();

    res.json({ message: 'User rejected', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

