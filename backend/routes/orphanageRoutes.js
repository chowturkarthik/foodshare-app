const express = require('express');
const Orphanage = require('../models/Orphanage');
const router = express.Router();

// GET /api/orphanages - Get all orphanages
router.get('/', async (req, res) => {
  try {
    const orphanages = await Orphanage.find({}).sort({ createdAt: -1 });
    res.json(orphanages);
  } catch (error) {
    console.error('Error fetching orphanages:', error);
    res.status(500).json({ message: 'Server error fetching orphanages' });
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
      message: 'Orphanage registered successfully',
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
