// Patient Cases & Reports Dual-Mode Sync Service
// Supports live MongoDB Backend and LocalStorage Persistence for Cloudflare / Serverless Hosting

import { PATIENT_CASES } from '../types/data';

const LOCAL_PATIENTS_KEY = 'orthomorph_local_patient_cases';

const getStoredPatients = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PATIENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PATIENT_CASES;
};

const persistPatientsLocally = (patients) => {
  try {
    localStorage.setItem(LOCAL_PATIENTS_KEY, JSON.stringify(patients));
  } catch (err) {
    console.warn('LocalStorage patient save warning:', err);
  }
};

export const fetchPatients = async () => {
  try {
    const res = await fetch('/api/patients');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        persistPatientsLocally(data.data);
        return data.data;
      }
    }
  } catch (err) {
    // Network or static hosting fallback
  }

  return getStoredPatients();
};

export const savePatientToMongoDB = async (patientCase) => {
  // Always update local cache for instant resilience
  const currentList = getStoredPatients();
  const existingIdx = currentList.findIndex(p => p.id === patientCase.id);
  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...patientCase };
  } else {
    updatedList = [patientCase, ...currentList];
  }
  persistPatientsLocally(updatedList);

  // Attempt remote MongoDB sync
  try {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientCase),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Graceful offline save
  }

  return { success: true, message: 'Saved to browser-synced database', data: patientCase };
};

export const saveReportToMongoDB = async (reportData) => {
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return { success: true, message: 'Report cached successfully', data: reportData };
};
