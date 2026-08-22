// Patient Cases & Reports MongoDB Sync Service
import { PATIENT_CASES } from '../types/data';

export const fetchPatients = async () => {
  try {
    const res = await fetch('/api/patients');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data && data.data.length > 0) {
      return data.data;
    }
    return PATIENT_CASES;
  } catch (err) {
    console.warn('Falling back to local patient dataset:', err.message);
    return PATIENT_CASES;
  }
};

export const savePatientToMongoDB = async (patientCase) => {
  try {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientCase),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to sync patient with MongoDB:', err);
    return { success: false, error: err.message };
  }
};

export const saveReportToMongoDB = async (reportData) => {
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to commit report to MongoDB:', err);
    return { success: false, error: err.message };
  }
};
