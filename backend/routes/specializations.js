const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization');
const DoctorProfile = require('../models/DoctorProfile');
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
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
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

// Get all specializations (full objects)
router.get('/all', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const specs = await Specialization.find().sort({ name: 1 });
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update specialization
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

  try {
    const trimmedName = name.trim();
    const oldSpec = await Specialization.findById(req.params.id);
    if (!oldSpec) return res.status(404).json({ message: 'Specialization not found' });

    const existing = await Specialization.findOne({ 
      name: new RegExp(`^${trimmedName}$`, 'i'),
      _id: { $ne: req.params.id }
    });
    if (existing) return res.status(400).json({ message: 'Specialization already exists' });

    const spec = await Specialization.findByIdAndUpdate(
      req.params.id,
      { name: trimmedName },
      { new: true }
    );
    
    // Update all doctor profiles that have the old name
    await DoctorProfile.updateMany(
      { specializations: oldSpec.name },
      { $set: { "specializations.$": trimmedName } }
    );

    res.json(spec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete specialization
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const spec = await Specialization.findById(req.params.id);
    if (!spec) return res.status(404).json({ message: 'Specialization not found' });

    await Specialization.findByIdAndDelete(req.params.id);

    // Remove this specialization from all doctor profiles
    await DoctorProfile.updateMany(
      { specializations: spec.name },
      { $pull: { specializations: spec.name } }
    );

    res.json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
