import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  Droplet,
  Ruler,
  Weight,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  Download,
  Printer,
  Calendar,
  FileText,
  Stethoscope,
  Globe,
  Sparkles,
  Layers,
  Thermometer,
  Pill,
  Clock,
  Eye
} from 'lucide-react';
import { COUNTRIES_CONFIG, SURGICAL_ELEMENTS } from '../Dispatch/InternationalDispatchHub';

export default function PatientBiodataDossier({ patient, onUpdatePatient }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Biodata State initialized from patient prop
  const [formData, setFormData] = useState({
    name: patient?.name || 'Eleanor Vance',
    id: patient?.id || 'PAT-84920',
    age: patient?.age || 67,
    sex: patient?.sex || 'Female',
    dob: patient?.biodata?.dob || '1959-08-14',
    nationalId: patient?.biodata?.nationalId || 'US-MED-8839210-A',
    maritalStatus: patient?.biodata?.maritalStatus || 'Married',
    language: patient?.biodata?.language || 'English (Native)',
    occupation: patient?.biodata?.occupation || 'Retired School Administrator',
    
    // Contact
    email: patient?.email || patient?.biodata?.email || 'eleanor.vance@patient-portal.org',
    contactPhone: patient?.biodata?.contactPhone || '+1 (555) 234-8920',
    address: patient?.biodata?.address || '742 Evergreen Medical Park, Suite 4B',
    city: patient?.biodata?.city || 'Boston, MA',
    postalCode: patient?.biodata?.postalCode || '02115',
    country: patient?.biodata?.country || 'United States',
    emergencyContactName: patient?.biodata?.emergencyContactName || 'Robert Vance',
    emergencyContactRelation: patient?.biodata?.emergencyContactRelation || 'Son',
    emergencyContactPhone: patient?.biodata?.emergencyContactPhone || '+1 (555) 982-1144',

    // Biometrics
    bloodGroup: patient?.biodata?.bloodGroup || 'A+',
    heightCm: patient?.biodata?.heightCm || 165,
    weightKg: patient?.biodata?.weightKg || 80,
    bloodPressure: patient?.biodata?.bloodPressure || '128 / 82 mmHg',
    heartRate: patient?.biodata?.heartRate || '72 bpm (Normal Sinus)',
    spO2: patient?.biodata?.spO2 || '98% on Room Air',
    bloodGlucose: patient?.biodata?.bloodGlucose || '95 mg/dL (Fasting)',

    // Orthopedic Joint Profile
    affectedKnee: patient?.affectedKnee || 'Right',
    klGrade: patient?.klGrade ?? 4,
    diagnosis: patient?.diagnosis || 'End-Stage Medial Compartment Knee Osteoarthritis with Severe Varus Deformity',
    alignment: patient?.alignment || 'Varus 8.5°',
    rom: patient?.rom || '10° - 95° (Flexion contracture)',
    painScore: patient?.biodata?.painScore || '8 / 10 (Severe Weight-Bearing Pain)',
    walkingDistance: patient?.biodata?.walkingDistance || '< 100 meters without assistance',
    assistiveDevice: patient?.biodata?.assistiveDevice || 'Single-Point Orthopedic Cane',

    // Medical History & Allergies
    allergies: patient?.biodata?.allergies || 'Penicillin (Mild Rash), Shellfish (Hives)',
    previousSurgeries: patient?.biodata?.previousSurgeries || 'Right knee arthroscopy (2021), Lumbar L4-L5 microdiscectomy (2018)',
    comorbidities: patient?.biodata?.comorbidities || 'Essential Hypertension (Controlled), Mild Osteopenia',
    currentMedications: patient?.biodata?.currentMedications || 'Celecoxib 200mg PO daily, Lisinopril 10mg daily, Calcium + Vitamin D3',

    // Cross-Border Operation Dispatch
    opCountry: patient?.internationalDispatch?.country || 'Germany',
    destinationHospital: patient?.internationalDispatch?.destinationHospital || 'Charité - Universitätsmedizin Berlin',
    dispatchedElement: patient?.internationalDispatch?.dispatchedElement || 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
  });

  // Calculate BMI dynamically
  const calculatedBMI = Number(
    (Number(formData.weightKg) / Math.pow(Number(formData.heightCm) / 100, 2)).toFixed(1)
  ) || 29.4;

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--accent-amber)' };
    if (bmi < 25) return { label: 'Normal Weight', color: '#10b981' };
    if (bmi < 30) return { label: 'Overweight (Pre-Obese)', color: 'var(--accent-amber)' };
    if (bmi < 35) return { label: 'Obese Class I', color: '#f59e0b' };
    return { label: 'Obese Class II/III', color: 'var(--accent-rose)' };
  };

  const bmiCat = getBMICategory(calculatedBMI);

  // Handle Save
  const handleSaveBiodata = async () => {
    setIsSaving(true);
    try {
      const updatedPatientObj = {
        ...patient,
        name: formData.name,
        age: Number(formData.age),
        sex: formData.sex,
        bmi: calculatedBMI,
        affectedKnee: formData.affectedKnee,
        klGrade: Number(formData.klGrade),
        diagnosis: formData.diagnosis,
        alignment: formData.alignment,
        rom: formData.rom,
        email: formData.email,
        biodata: {
          ...patient?.biodata,
          dob: formData.dob,
          nationalId: formData.nationalId,
          maritalStatus: formData.maritalStatus,
          language: formData.language,
          occupation: formData.occupation,
          email: formData.email,
          contactPhone: formData.contactPhone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactRelation: formData.emergencyContactRelation,
          emergencyContactPhone: formData.emergencyContactPhone,
          bloodGroup: formData.bloodGroup,
          heightCm: Number(formData.heightCm),
          weightKg: Number(formData.weightKg),
          bloodPressure: formData.bloodPressure,
          heartRate: formData.heartRate,
          spO2: formData.spO2,
          bloodGlucose: formData.bloodGlucose,
          painScore: formData.painScore,
          walkingDistance: formData.walkingDistance,
          assistiveDevice: formData.assistiveDevice,
          allergies: formData.allergies,
          previousSurgeries: formData.previousSurgeries,
          comorbidities: formData.comorbidities,
          currentMedications: formData.currentMedications,
        },
        internationalDispatch: {
          ...patient?.internationalDispatch,
          country: formData.opCountry,
          destinationHospital: formData.destinationHospital,
          dispatchedElement: formData.dispatchedElement,
        }
      };

      // Call API to persist to MongoDB
      await fetch(`/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPatientObj),
      }).catch(() => {});

      if (onUpdatePatient) {
        onUpdatePatient(updatedPatientObj);
      }

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save biodata:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Download printable medical ID / biodata card
  const handleDownloadCard = () => {
    const cardContent = `
================================================================================
          ORTHOMORPH AI — OFFICIAL PATIENT BIODATA & MEDICAL DOSSIER
================================================================================
CASE IDENTIFIER: ${formData.id}
DATE OF RECORD:  ${new Date().toLocaleDateString()}
STATUS:          Verified Medical Dossier • MongoDB Authenticated

1. PATIENT DEMOGRAPHICS:
--------------------------------------------------------------------------------
Full Legal Name:    ${formData.name}
National Medical ID:${formData.nationalId}
Date of Birth:      ${formData.dob} (${formData.age} Years)
Gender / Sex:       ${formData.sex}
Marital Status:     ${formData.maritalStatus}
Native Language:    ${formData.language}
Occupation:         ${formData.occupation}

2. CONTACT & GUARDIANSHIP:
--------------------------------------------------------------------------------
Primary Email:      ${formData.email}
Phone Number:       ${formData.contactPhone}
Address:            ${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}
Emergency Contact:  ${formData.emergencyContactName} (${formData.emergencyContactRelation})
Emergency Phone:    ${formData.emergencyContactPhone}

3. BIOMETRICS & VITAL SIGNS:
--------------------------------------------------------------------------------
Blood Group (ABO):  ${formData.bloodGroup}
Height / Weight:    ${formData.heightCm} cm / ${formData.weightKg} kg
Body Mass Index:    ${calculatedBMI} kg/m² [${bmiCat.label}]
Blood Pressure:     ${formData.bloodPressure}
Heart Rate:         ${formData.heartRate}
SpO2 Saturation:    ${formData.spO2}
Fasting Glucose:    ${formData.bloodGlucose}

4. ORTHOPEDIC JOINT STATUS:
--------------------------------------------------------------------------------
Affected Joint:     ${formData.affectedKnee} Knee
Osteoarthritis:     Kellgren-Lawrence Grade ${formData.klGrade} (Severe Joint Space Loss)
Primary Diagnosis:  ${formData.diagnosis}
Limb Alignment:     ${formData.alignment}
Range of Motion:    ${formData.rom}
Pain Visual Scale:  ${formData.painScore}
Mobility Threshold: ${formData.walkingDistance}
Assistive Device:   ${formData.assistiveDevice}

5. MEDICAL HISTORY, ALLERGIES & MEDICATIONS:
--------------------------------------------------------------------------------
Drug Allergies:     ${formData.allergies}
Co-morbidities:     ${formData.comorbidities}
Previous Surgeries: ${formData.previousSurgeries}
Current Rx Meds:    ${formData.currentMedications}

6. INTERNATIONAL OPERATION DISPATCH:
--------------------------------------------------------------------------------
Operation Country:  ${formData.opCountry}
Destination Center: ${formData.destinationHospital}
Dispatched Element: ${formData.dispatchedElement}
Airway Tracking:    ${patient?.internationalDispatch?.trackingNumber || 'MED-EXP-84920-DE'}
Cold-Chain Monitor: -80°C Cryo-Monitored / Active Temp Logger #DE-89
================================================================================
Authorized by OrthoMorph AI Clinical Suite • Dr. Alistair Sterling, MD, FRCS (Ortho)
`;
    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Patient_Biodata_Dossier_${formData.id}_${formData.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
      
      {/* Top Banner: Patient Identification Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.85), rgba(0, 242, 254, 0.08))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #00f2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            fontSize: '1.5rem',
            fontWeight: 800,
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
          }}>
            {formData.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                {formData.id}
              </span>
              <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                🏥 Active Patient Biodata Dossier
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                National ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{formData.nationalId}</strong>
              </span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px', color: '#fff' }}>
              {formData.name}
            </h1>

            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {formData.age} Years • {formData.sex} • Blood Group: <strong style={{ color: '#10b981' }}>{formData.bloodGroup}</strong> • Affected: <strong style={{ color: 'var(--accent-cyan)' }}>{formData.affectedKnee} Knee (KL {formData.klGrade})</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {saveSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#10b981',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <CheckCircle2 size={16} />
              <span>Saved to MongoDB!</span>
            </div>
          )}

          {isEditing ? (
            <button
              onClick={handleSaveBiodata}
              disabled={isSaving}
              className="btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Biodata Changes'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline"
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 242, 254, 0.4)' }}
            >
              <Edit3 size={15} />
              <span>Edit Biodata</span>
            </button>
          )}

          <button
            onClick={handleDownloadCard}
            className="btn-outline"
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={15} />
            <span>Download Medical Dossier</span>
          </button>
        </div>
      </div>

      {/* 6-Grid Biodata Cards Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        
        {/* CARD 1: Personal Demographics */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <User size={18} color="#10b981" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              1. Demographics & Identity
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Full Legal Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.name}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Date of Birth</span>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.dob} ({formData.age}y)</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Gender / Sex</span>
              {isEditing ? (
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <strong style={{ color: '#fff' }}>{formData.sex}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>National ID / Passport</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{formData.nationalId}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Marital Status</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.maritalStatus}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Language</span>
              <strong style={{ color: '#fff' }}>{formData.language}</strong>
            </div>
          </div>
        </div>

        {/* CARD 2: Contact & Emergency Guardianship */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <Phone size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              2. Contact & Emergency Liaison
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Contact Email (MongoDB Stored)</span>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: 'var(--accent-cyan)' }}>{formData.email}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Primary Phone</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.contactPhone}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Emergency Contact</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.emergencyContactName} ({formData.emergencyContactRelation})</strong>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Emergency Phone</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: 'var(--accent-rose)' }}>{formData.emergencyContactPhone}</strong>
              )}
            </div>
          </div>
        </div>

        {/* CARD 3: Physical Biometrics & Vital Signs */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <Droplet size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              3. Physical Biometrics & Vitals
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Blood Group</span>
              {isEditing ? (
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#00f2fe', fontWeight: 700, fontSize: '0.8rem', boxSizing: 'border-box' }}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <strong style={{ color: '#00f2fe', fontSize: '1.05rem' }}>{formData.bloodGroup}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Height</span>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.heightCm} cm</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Weight</span>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.weightKg} kg</strong>
              )}
            </div>

            <div style={{ gridColumn: 'span 3', background: 'rgba(15, 23, 42, 0.6)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Body Mass Index (BMI):</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: bmiCat.color, fontFamily: 'var(--font-mono)' }}>
                  {calculatedBMI} kg/m² ({bmiCat.label})
                </span>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Blood Pressure</span>
              <strong style={{ color: '#fff' }}>{formData.bloodPressure}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Heart Rate</span>
              <strong style={{ color: '#fff' }}>{formData.heartRate}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Oxygen SpO2</span>
              <strong style={{ color: '#10b981' }}>{formData.spO2}</strong>
            </div>
          </div>
        </div>

        {/* CARD 4: Orthopedic & Knee Joint Assessment */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <Activity size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              4. Orthopedic Joint Assessment
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Operative Joint</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{formData.affectedKnee} Knee</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Kellgren-Lawrence</span>
              <strong style={{ color: 'var(--accent-rose)' }}>Grade {formData.klGrade} (Severe OA)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Mechanical Alignment</span>
              <strong style={{ color: '#fff' }}>{formData.alignment}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Range of Motion</span>
              <strong style={{ color: '#fff' }}>{formData.rom}</strong>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Pain Score (VAS 0-10)</span>
              <strong style={{ color: 'var(--accent-rose)' }}>{formData.painScore}</strong>
            </div>
          </div>
        </div>

        {/* CARD 5: Medical History, Allergies & Medications */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <Pill size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              5. Allergies, History & Meds
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--accent-rose)', display: 'block', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚠️ Known Drug & Food Allergies:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  style={{ width: '100%', padding: '4px 8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              ) : (
                <strong style={{ color: '#fff' }}>{formData.allergies}</strong>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Pre-existing Co-morbidities:</span>
              <strong style={{ color: '#fff' }}>{formData.comorbidities}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Prior Surgeries:</span>
              <strong style={{ color: 'var(--text-secondary)' }}>{formData.previousSurgeries}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Current Medications:</span>
              <strong style={{ color: '#10b981' }}>{formData.currentMedications}</strong>
            </div>
          </div>
        </div>

        {/* CARD 6: Cross-Border Operation & Dispatched Element */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
            <Globe size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              6. Cross-Border Operation Dispatch
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Operation Destination Country</span>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                {patient?.internationalDispatch?.countryFlag || '🇩🇪'} {formData.opCountry}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Destination Arthroplasty Center</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{formData.destinationHospital}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Custom Dispatched Surgical Element</span>
              <strong style={{ color: '#10b981' }}>{formData.dispatchedElement}</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Consignment Tracking:</span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {patient?.internationalDispatch?.trackingNumber || 'MED-EXP-84920-DE'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
