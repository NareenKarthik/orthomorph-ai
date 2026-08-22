import express from 'express';
import Report from '../models/Report.js';
import { authenticate } from './auth.js';

const router = express.Router();

// @route   GET /api/reports
// @desc    Get all surgical reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to query surgical reports', error: err.message });
  }
});

// @route   POST /api/reports
// @desc    Save surgical report
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;
    if (!reportData.reportId || !reportData.patientId) {
      return res.status(400).json({ success: false, message: 'Report ID and Patient ID are required' });
    }

    const report = await Report.findOneAndUpdate(
      { reportId: reportData.reportId },
      { ...reportData, signedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Surgical report committed to MongoDB',
      data: report,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to save surgical report', error: err.message });
  }
});

export default router;
