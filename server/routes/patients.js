import express from 'express';
import Patient from '../models/Patient.js';
import { authenticate } from './auth.js';

const router = express.Router();

// @route   GET /api/patients
// @desc    Get all clinical patient cases from MongoDB
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch patients from MongoDB', error: err.message });
  }
});

// @route   GET /api/patients/:id
// @desc    Get single patient case
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient case not found' });
    }
    return res.json({ success: true, data: patient });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Database query error', error: err.message });
  }
});

// @route   POST /api/patients
// @desc    Create or upsert a patient case
router.post('/', async (req, res) => {
  try {
    const patientData = req.body;
    if (!patientData.id || !patientData.name) {
      return res.status(400).json({ success: false, message: 'Patient ID and Name are required' });
    }

    const patient = await Patient.findOneAndUpdate(
      { id: patientData.id },
      { ...patientData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Patient record saved to MongoDB',
      data: patient,
    });
  } catch (err) {
    console.error('Error saving patient:', err);
    return res.status(500).json({ success: false, message: 'Failed to save patient record', error: err.message });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update an existing patient record including biodata
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    return res.json({
      success: true,
      message: 'Patient biodata and records updated successfully',
      data: updatedPatient,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update patient', error: err.message });
  }
});

// @route   PATCH /api/patients/:id/biodata
// @desc    Update only the biodata subdocument of a patient
router.patch('/:id/biodata', async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    patient.biodata = { ...patient.biodata, ...req.body };
    if (req.body.age) patient.age = Number(req.body.age);
    if (req.body.sex) patient.sex = req.body.sex;
    if (req.body.bmi) patient.bmi = Number(req.body.bmi);

    await patient.save();

    return res.json({
      success: true,
      message: 'Patient personal biodata updated in MongoDB',
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to patch biodata', error: err.message });
  }
});

export default router;
