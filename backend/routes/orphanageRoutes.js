const express = require('express');
const jwt = require('jsonwebtoken');
const Orphanage = require('../models/Orphanage');
const router = express.Router();

// GET /api/orphanages - Get approved orphanages (public)
router.get('/', async (req, res) => {
  try {
    const orphanages = await Orphanage.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(orphanages);
  } catch (error) {
    console.error('Error fetching orphanages:', error);
    res.status(500).json({ message: 'Server error fetching orphanages' });
  }
});

// POST /api/admin/login - Admin login (POST to /api/orphanages/login due to mounting)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const ADMIN_USERNAME = 'karthik';
    const ADMIN_PASSWORD = 'SecureRandomPass123!'; // Change in prod, use env

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', { expiresIn: '7d' });
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/pending - Get pending orphanages
router.get('/pending', async (req, res) => {
  try {
    const orphanages = await Orphanage.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(orphanages);
  } catch (error) {
    console.error('Error fetching pending:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/:id/approve - Approve orphanage
router.patch('/:id/approve', async (req, res) => {
  try {
    const orphanage = await Orphanage.findById(req.params.id);
    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    orphanage.status = 'approved';
    orphanage.isApproved = true;
    await orphanage.save();

res.json({ message: 'Orphanage approved', orphanage });
  } catch (error) {
    console.error('Error approving:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/orphanages/:id/reject - Reject orphanage (admin)
router.patch('/:id/reject', async (req, res) => {
  try {
    const orphanage = await Orphanage.findById(req.params.id);
    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }
    if (orphanage.isApproved) {
      return res.status(400).json({ message: 'Already approved' });
    }

    orphanage.status = 'rejected';
    orphanage.isApproved = false;
    await orphanage.save();

    res.json({ message: 'Orphanage rejected', orphanage });
  } catch (error) {
    console.error('Error rejecting:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/orphanages - Create new orphanage
router.post('/', async (req, res) => {
  try {
    const { name, city, phone, address } = req.body;

    // Basic validation
    if (!name || !city || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const newOrphanage = new Orphanage({ name, city, phone, address });
    await newOrphanage.save();

    res.status(201).json({ 
      message: 'Orphanage submitted for admin approval',
      orphanage: newOrphanage 
    });
  } catch (error) {
    console.error('Error creating orphanage:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error creating orphanage' });
  }
});

module.exports = router;
