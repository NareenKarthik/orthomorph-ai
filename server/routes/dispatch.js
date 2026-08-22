import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

// @route   GET /api/dispatch
// @desc    Get all international operation dispatch orders
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({ 'internationalDispatch.country': { $exists: true } });
    const orders = patients.map(p => ({
      patientId: p.id,
      patientName: p.name,
      age: p.age,
      sex: p.sex,
      affectedKnee: p.affectedKnee,
      biodata: p.biodata,
      internationalDispatch: p.internationalDispatch,
      implantRecommendation: p.implantRecommendation,
      updatedAt: p.updatedAt,
    }));

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dispatch orders', error: err.message });
  }
});

// @route   POST /api/dispatch/:patientId
// @desc    Update or configure cross-border surgical element dispatch for a patient
router.post('/:patientId', async (req, res) => {
  try {
    const { country, destinationHospital, dispatchedElement, elementCategory, implantSpecs, dispatchStatus, trackingNumber } = req.body;

    const patient = await Patient.findOne({ id: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    patient.internationalDispatch = {
      ...patient.internationalDispatch,
      country: country || patient.internationalDispatch?.country || 'Germany',
      destinationHospital: destinationHospital || patient.internationalDispatch?.destinationHospital,
      dispatchedElement: dispatchedElement || patient.internationalDispatch?.dispatchedElement,
      elementCategory: elementCategory || patient.internationalDispatch?.elementCategory,
      implantSpecs: implantSpecs || patient.internationalDispatch?.implantSpecs,
      dispatchStatus: dispatchStatus || patient.internationalDispatch?.dispatchStatus || 'Dispatched to International OR',
      trackingNumber: trackingNumber || patient.internationalDispatch?.trackingNumber,
    };

    await patient.save();

    return res.json({
      success: true,
      message: 'Cross-border surgical element dispatch updated in MongoDB',
      data: patient.internationalDispatch,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update dispatch order', error: err.message });
  }
});

export default router;
