const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization');
const { authenticate, authorize } = require('../middlewares/auth');

// Get all specializations
router.get('/', async (req, res) => {
  try {
    const specs = await Specialization.find().sort({ name: 1 });
    res.json(specs.map(s => s.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new specialization
router.post('/', authenticate, authorize(['admin', 'doctor']), async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

  try {
    const trimmedName = name.trim();
    const existing = await Specialization.findOne({ name: new RegExp(`^${trimmedName}$`, 'i') });
    if (existing) return res.status(400).json({ message: 'Specialization already exists' });

    const spec = await Specialization.create({ name: trimmedName });
    res.json({ name: spec.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
