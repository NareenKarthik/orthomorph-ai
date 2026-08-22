import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  FileText, 
  Calendar, 
  Activity, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPatientFromHistoricalRecord } from '../../types/data';

export default function UploadScanModal({ isOpen, onClose, onPatientCreatedAndSelected }) {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState(58);
  const [sex, setSex] = useState('Female');
  const [affectedKnee, setAffectedKnee] = useState('Right');
  const [klGrade, setKlGrade] = useState(3);
  const [symptoms, setSymptoms] = useState('Severe medial knee joint pain on walking, morning stiffness');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageSrc) {
      alert('Please upload an image, MRI, or CT scan photo first.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newPatientRecord = {
        id: `PAT-UPL-${Math.floor(1000 + Math.random() * 9000)}`,
        name: patientName.trim() || `Patient ${fileName.split('.')[0]}`,
        age: parseInt(age) || 58,
        sex,
        affectedKnee,
        klGrade: parseInt(klGrade),
        diagnosis: `Uploaded Scan: Kellgren-Lawrence Grade ${klGrade} Medial Knee Osteoarthritis`,
        symptoms: symptoms.trim(),
        surgeryDate: new Date().toISOString().split('T')[0],
        procedure: klGrade >= 3 ? "Total Knee Arthroplasty (TKA)" : "Unicompartmental Knee Arthroplasty (UKA)",
        implantUsed: klGrade >= 3 ? "Zimmer Persona Standard" : "Oxford UKA Medial",
        surgeon: "Attending Orthopedic Radiologist / Surgeon",
        preOpWOMAC: klGrade === 4 ? 80 : klGrade === 3 ? 65 : 45,
        postOpWOMAC1Yr: 15,
        preOpOKS: klGrade === 4 ? 12 : 22,
        postOpOKS1Yr: 42,
        status: "Newly Uploaded Active Scan"
      };

      const fullPatientCase = createPatientFromHistoricalRecord(newPatientRecord, imageSrc);
      
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00f2fe', '#10b981', '#f59e0b']
      });

      setIsProcessing(false);
      onPatientCreatedAndSelected(fullPatientCase, newPatientRecord);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #00f2fe, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050b14'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Upload Patient Knee Scan / Photo</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Upload an MRI, CT, X-ray, or medical photo for MONAI AI segmentation & implant sizing
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Drag and Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : imageSrc ? 'var(--accent-emerald)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              background: dragActive ? 'rgba(0, 242, 254, 0.08)' : imageSrc ? 'rgba(16, 185, 129, 0.04)' : 'rgba(15, 23, 42, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              accept="image/*,.dcm"
              style={{ display: 'none' }}
            />

            {imageSrc ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src={imageSrc} 
                  alt="Uploaded Knee Scan Preview" 
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-emerald)' }} 
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Image Attached: {fileName}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                    Click or drag another image to replace.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <ImageIcon size={26} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block' }}>
                    Click to browse or drag & drop knee scan photo
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supports PNG, JPG, JPEG, WebP, DICOM photo (Coronal / Sagittal / Axial)
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Patient Details Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Patient Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Patient Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jonathan Hayes"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Age & Sex */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Sex
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>

            {/* Affected Knee */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Affected Joint
              </label>
              <select
                value={affectedKnee}
                onChange={(e) => setAffectedKnee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="Right">Right Knee</option>
                <option value="Left">Left Knee</option>
                <option value="Bilateral">Bilateral</option>
              </select>
            </div>

            {/* Suspected KL OA Severity */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Osteoarthritis Grade (KL 0-4)
              </label>
              <select
                value={klGrade}
                onChange={(e) => setKlGrade(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="0">KL Grade 0 (Healthy / Normal)</option>
                <option value="1">KL Grade 1 (Doubtful JSW narrowing)</option>
                <option value="2">KL Grade 2 (Definite Osteophytes / UKA Candidate)</option>
                <option value="3">KL Grade 3 (Moderate JSW Narrowing & Meniscus Tear)</option>
                <option value="4">KL Grade 4 (Severe Bone-on-Bone OA & Maceration)</option>
              </select>
            </div>

          </div>

          {/* Clinical Symptoms */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Clinical Symptoms & Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Medial joint line tenderness, crepitus, walking distance limited to 200m"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isProcessing || !imageSrc}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Segmenting Anatomy & Sizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Run AI Segmentation & Open Patient</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
