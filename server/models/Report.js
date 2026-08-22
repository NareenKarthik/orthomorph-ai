import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: String,
    surgeonName: String,
    surgeonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportType: {
      type: String,
      default: 'Gemini AI Knee Arthroplasty Surgical Plan',
    },
    generatedReportText: {
      type: String,
      required: true,
    },
    implantRecommendation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    morphometricsSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    aiMetricsSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Draft', 'Physician Reviewed', 'Approved for OR', 'Archived'],
      default: 'Physician Reviewed',
    },
    signedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
