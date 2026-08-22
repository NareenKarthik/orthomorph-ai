import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import UploadScanModal from './components/UploadModal/UploadScanModal';
import AuthModal from './components/Auth/AuthModal';
import LoginPage from './components/Auth/LoginPage';
import DicomViewer from './components/DicomViewer/DicomViewer';
import MeniscusMeasurement from './components/Morphometry/MeniscusMeasurement';
import ImplantSizingSuite from './components/ImplantSizing/ImplantSizingSuite';
import BiostatisticsHub from './components/PopulationStats/BiostatisticsHub';
import Knee3DReconstruction from './components/ThreeDViewer/Knee3DReconstruction';
import GeminiReportGenerator from './components/ClinicalReport/GeminiReportGenerator';
import HospitalPatientRegistry from './components/HospitalRegistry/HospitalPatientRegistry';
import InternationalDispatchHub from './components/Dispatch/InternationalDispatchHub';
import PatientBiodataDossier from './components/Biodata/PatientBiodataDossier';
import { PATIENT_CASES } from './types/data';
import { useAuth } from './context/AuthContext';
import { fetchPatients, savePatientToMongoDB } from './services/patientApiService';
import { Globe, Plane, UserCheck } from 'lucide-react';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [patients, setPatients] = useState(PATIENT_CASES);
  const [activePatient, setActivePatient] = useState(PATIENT_CASES[0]);
  const [activeTab, setActiveTab] = useState('dicom'); // 'dicom' | 'biodata' | 'morphometry' | 'implant' | 'biostats' | '3d-knee' | 'dispatch' | 'registry' | 'report'
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync patient cases from MongoDB
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadDbPatients = async () => {
      try {
        const dbPatients = await fetchPatients();
        if (dbPatients && dbPatients.length > 0) {
          setPatients(dbPatients);
          setActivePatient(dbPatients[0]);
        }
      } catch (err) {
        console.warn('Using local patient registry fallback:', err);
      }
    };
    loadDbPatients();
  }, [isAuthenticated]);

  const exportPatientPlan = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activePatient, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OrthoMorph_Plan_${activePatient.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePatientSelected = (patientObj) => {
    setPatients(prev => {
      const exists = prev.some(p => p.id === patientObj.id);
      if (!exists) {
        return [patientObj, ...prev];
      }
      return prev;
    });
    setActivePatient(patientObj);
    setActiveTab('dicom');
  };

  const handlePatientUpdated = (updatedPatient) => {
    setActivePatient(updatedPatient);
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleNewUploadedPatient = async (newPatientCase, newHistoricalRecord) => {
    setPatients(prev => [newPatientCase, ...prev]);
    setActivePatient(newPatientCase);
    setActiveTab('dicom');

    // Persist to MongoDB in background
    await savePatientToMongoDB(newPatientCase);
  };

  // If not logged in, render the Dedicated Medical Login & Two-Step Verification Portal
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const dispatch = activePatient?.internationalDispatch;

  return (
    <div className="app-container">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patients={patients}
        activePatient={activePatient}
        setActivePatient={setActivePatient}
        openApiKeyModal={() => setIsApiKeyModalOpen(true)}
        openUploadModal={() => setIsUploadModalOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        exportReport={exportPatientPlan}
      />

      {/* Main Workspace Body */}
      <main className="main-content">
        
        {/* Quick Patient Demographics Summary Bar */}
        <div className="patient-summary-card">
          <div className="patient-info-left">
            <div className="avatar-badge" onClick={() => setActiveTab('biodata')} style={{ cursor: 'pointer' }} title="Click to view full Personal Biodata Dossier">
              {activePatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{activePatient.name}</h2>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  {activePatient.id}
                </span>
                <span className={`meta-pill pill-kl-${activePatient.klGrade}`}>
                  KL Grade {activePatient.klGrade} ({activePatient.klGrade >= 3 ? 'Advanced OA' : activePatient.klGrade === 0 ? 'Healthy' : 'Moderate OA'})
                </span>

                {/* Direct Biodata Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('biodata')}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10b981',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <UserCheck size={12} />
                  <span>Personal Biodata Dossier</span>
                </button>

                {/* Country Operation Badge */}
                {dispatch?.country && (
                  <span 
                    onClick={() => setActiveTab('dispatch')}
                    className="brand-badge" 
                    style={{ 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      color: '#10b981', 
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      cursor: 'pointer',
                    }}
                    title={`Click to view cross-border surgical element dispatch for ${dispatch.country}`}
                  >
                    {dispatch.countryFlag || '🌐'} Operation in {dispatch.country}
                  </span>
                )}

                {dispatch?.dispatchedElement && (
                  <span 
                    onClick={() => setActiveTab('dispatch')}
                    className="brand-badge" 
                    style={{ 
                      background: 'rgba(0, 242, 254, 0.12)', 
                      color: 'var(--accent-cyan)', 
                      borderColor: 'rgba(0, 242, 254, 0.3)',
                      cursor: 'pointer',
                      maxWidth: '280px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={dispatch.dispatchedElement}
                  >
                    ✈️ {dispatch.dispatchedElement}
                  </span>
                )}

                {user && (
                  <span className="brand-badge" style={{ background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 242, 254, 0.3)' }}>
                    🩺 Attending: {user.name} ({user.role})
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activePatient.diagnosis}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="patient-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Exam / Joint</span>
              <span className="meta-value">{activePatient.affectedKnee} Knee</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Age & Sex</span>
              <span className="meta-value">{activePatient.age}y / {activePatient.sex}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Blood Group</span>
              <span className="meta-value" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {activePatient.biodata?.bloodGroup || 'O+'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">BMI & Height</span>
              <span className="meta-value">
                {activePatient.bmi} kg/m² ({activePatient.biodata?.heightCm || 168}cm)
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Meniscus Mean</span>
              <span className="meta-value" style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {activePatient.morphometrics?.medialMeniscus?.meanThickness ?? 1.13} mm
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'dicom' && (
          <DicomViewer 
            patient={activePatient} 
            openUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'biodata' && (
          <PatientBiodataDossier 
            patient={activePatient} 
            onUpdatePatient={handlePatientUpdated}
          />
        )}

        {activeTab === 'morphometry' && (
          <MeniscusMeasurement patient={activePatient} />
        )}

        {activeTab === 'implant' && (
          <ImplantSizingSuite patient={activePatient} />
        )}

        {activeTab === 'biostats' && (
          <BiostatisticsHub activePatient={activePatient} />
        )}

        {activeTab === '3d-knee' && (
          <Knee3DReconstruction patient={activePatient} />
        )}

        {activeTab === 'dispatch' && (
          <InternationalDispatchHub activePatient={activePatient} />
        )}

        {activeTab === 'registry' && (
          <HospitalPatientRegistry 
            currentPatients={patients}
            onSelectPatientForAnalysis={handlePatientSelected}
            openUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'report' && (
          <GeminiReportGenerator 
            patient={activePatient} 
            openApiKeyModal={() => setIsApiKeyModalOpen(true)} 
          />
        )}

      </main>

      {/* Switch Doctor Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {}}
      />

      {/* Upload Scan / Photo Modal */}
      <UploadScanModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPatientCreatedAndSelected={handleNewUploadedPatient}
      />
    </div>
  );
}


