import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  UserPlus, 
  CheckCircle2, 
  Calendar, 
  Stethoscope, 
  Activity, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { HOSPITAL_HISTORICAL_REGISTRY, createPatientFromHistoricalRecord } from '../../types/data';

export default function HospitalPatientRegistry({ onSelectPatientForAnalysis, currentPatients, openUploadModal }) {
  const [registry, setRegistry] = useState(HOSPITAL_HISTORICAL_REGISTRY);
  const [searchQuery, setSearchQuery] = useState('');
  const [procedureFilter, setProcedureFilter] = useState('all');
  const [surgeonFilter, setSurgeonFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(HOSPITAL_HISTORICAL_REGISTRY[0]);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Filter Registry
  const filteredRecords = registry.filter(rec => {
    if (procedureFilter !== 'all' && !rec.procedure.toLowerCase().includes(procedureFilter.toLowerCase())) return false;
    if (surgeonFilter !== 'all' && rec.surgeon !== surgeonFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.name.toLowerCase().includes(q) ||
        rec.id.toLowerCase().includes(q) ||
        rec.diagnosis.toLowerCase().includes(q) ||
        rec.implantUsed.toLowerCase().includes(q) ||
        rec.surgeon.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle CSV / JSON Dataset Import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setRegistry(prev => [...parsed, ...prev]);
            setImportStatus({ success: true, message: `Successfully imported ${parsed.length} patient records from JSON!` });
          } else {
            setRegistry(prev => [parsed, ...prev]);
            setImportStatus({ success: true, message: `Successfully imported 1 patient record from JSON!` });
          }
        } else {
          // Parse CSV
          const lines = text.trim().split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const newRecords = [];

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (cols.length >= 5) {
              newRecords.push({
                id: cols[0] || `HOSP-IMP-${Date.now()}-${i}`,
                name: cols[1] || `Imported Patient ${i}`,
                age: parseInt(cols[2]) || 60,
                sex: cols[3] || "Female",
                diagnosis: cols[4] || "Knee Osteoarthritis",
                klGrade: parseInt(cols[5]) || 3,
                affectedKnee: cols[6] || "Right",
                surgeryDate: cols[7] || "2025-10-15",
                procedure: cols[8] || "Total Knee Arthroplasty (TKA)",
                implantUsed: cols[9] || "Zimmer Persona Standard",
                surgeon: cols[10] || "Dr. Alistair Sterling",
                preOpWOMAC: parseInt(cols[11]) || 70,
                postOpWOMAC1Yr: parseInt(cols[12]) || 15,
                preOpOKS: parseInt(cols[13]) || 18,
                postOpOKS1Yr: parseInt(cols[14]) || 44,
                meniscalDeficit: "75% loss",
                complications: "None",
                status: "Imported Record"
              });
            }
          }

          if (newRecords.length > 0) {
            setRegistry(prev => [...newRecords, ...prev]);
            setImportStatus({ success: true, message: `Successfully parsed & imported ${newRecords.length} records from CSV!` });
          } else {
            setImportStatus({ success: false, message: 'Invalid CSV format. Please ensure headers are present.' });
          }
        }
      } catch (err) {
        setImportStatus({ success: false, message: `Import error: ${err.message}` });
      }
    };

    reader.readAsText(file);
  };

  // Export Registry to CSV
  const handleExportRegistryCsv = () => {
    const headers = "ID,Name,Age,Sex,Diagnosis,KL_Grade,Knee,Surgery_Date,Procedure,Implant_Used,Surgeon,PreOp_WOMAC,PostOp_WOMAC_1Yr,PreOp_OKS,PostOp_OKS_1Yr,Status\n";
    const rows = registry.map(r => 
      `"${r.id}","${r.name}",${r.age},"${r.sex}","${r.diagnosis}",${r.klGrade},"${r.affectedKnee}","${r.surgeryDate}","${r.procedure}","${r.implantUsed}","${r.surgeon}",${r.preOpWOMAC},${r.postOpWOMAC1Yr},${r.preOpOKS},${r.postOpOKS1Yr},"${r.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hospital_Knee_Arthroplasty_Registry_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Hospital Center Overview */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 46, 
            height: 46, 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #10b981, #00f2fe)', 
            color: '#050b14', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Hospital Knee Arthroplasty & Meniscus Patient Registry</h3>
              <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                {registry.length} Historical Records
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Longitudinal clinical outcomes, surgical implant tracking, pre/post-op WOMAC & Oxford Knee Scores (OKS)
            </p>
          </div>
        </div>

        {/* Import & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {openUploadModal && (
            <button 
              className="btn-primary"
              onClick={openUploadModal}
              title="Upload new patient scan, MRI/CT, or medical photo"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
            >
              <Upload size={14} />
              <span>Upload Scan/Photo</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.json"
            style={{ display: 'none' }}
          />

          <button 
            className="btn-outline"
            onClick={() => fileInputRef.current?.click()}
            title="Import custom patient records from CSV or JSON"
          >
            <Upload size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Import Clinical Dataset</span>
          </button>

          <button 
            className="btn-outline"
            onClick={handleExportRegistryCsv}
            title="Export all historical patient data to CSV"
          >
            <Download size={14} />
            <span>Export Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Import Feedback Alert */}
      {importStatus && (
        <div style={{
          background: importStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          border: `1px solid ${importStatus.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: importStatus.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {importStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{importStatus.message}</span>
          </div>
          <button 
            onClick={() => setImportStatus(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Hospital KPI Stats Row */}
      <div className="grid-4col">
        <div className="glass-panel kpi-card emerald">
          <span className="kpi-title">Total Arthroplasty Cohort</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">1,482</span>
            <span className="kpi-unit">Cases</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
            +142 this quarter
          </span>
        </div>

        <div className="glass-panel kpi-card">
          <span className="kpi-title">Mean WOMAC Pain Improvement</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">+48.2</span>
            <span className="kpi-unit">pts</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
            Pre-Op 74.5 → Post-Op 13.8
          </span>
        </div>

        <div className="glass-panel kpi-card purple">
          <span className="kpi-title">Oxford Knee Score (OKS) Rate</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">96.4%</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-purple)' }}>
            Score &gt; 40/48 at 1 Year
          </span>
        </div>

        <div className="glass-panel kpi-card amber">
          <span className="kpi-title">2-Year Implant Survival</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">99.2%</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            Zero overhang loosening
          </span>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Selected Patient Deep-Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Patient Records Explorer */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          
          {/* Search & Filter Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search patient, diagnosis, implant, surgeon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                value={procedureFilter} 
                onChange={(e) => setProcedureFilter(e.target.value)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.78rem', padding: '5px 8px', borderRadius: 'var(--radius-md)', outline: 'none' }}
              >
                <option value="all">All Procedures</option>
                <option value="TKA">Total Knee (TKA)</option>
                <option value="UKA">Partial Knee (UKA)</option>
                <option value="HTO">High Tibial Osteotomy</option>
              </select>

              <select 
                value={surgeonFilter} 
                onChange={(e) => setSurgeonFilter(e.target.value)}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.78rem', padding: '5px 8px', borderRadius: 'var(--radius-md)', outline: 'none' }}
              >
                <option value="all">All Attending Surgeons</option>
                <option value="Dr. Alistair Sterling">Dr. Alistair Sterling</option>
                <option value="Dr. Samantha Reed">Dr. Samantha Reed</option>
                <option value="Dr. Ethan Hayes">Dr. Ethan Hayes</option>
              </select>
            </div>
          </div>

          {/* Registry Table */}
          <div style={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 10px' }}>Patient / MRN</th>
                  <th style={{ padding: '8px 10px' }}>Knee & Diagnosis</th>
                  <th style={{ padding: '8px 10px' }}>Procedure & Implant</th>
                  <th style={{ padding: '8px 10px' }}>Surgeon</th>
                  <th style={{ padding: '8px 10px' }}>WOMAC (Pre/Post)</th>
                  <th style={{ padding: '8px 10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => {
                  const isSelected = selectedRecord?.id === record.id;
                  const womacDelta = record.preOpWOMAC - record.postOpWOMAC1Yr;

                  return (
                    <tr 
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{record.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{record.id} ({record.age}y / {record.sex})</div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ color: 'var(--text-primary)' }}>{record.affectedKnee} Knee - KL {record.klGrade}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{record.diagnosis}</div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{record.procedure}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{record.implantUsed}</div>
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>
                        {record.surgeon}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                          {record.preOpWOMAC} → {record.postOpWOMAC1Yr}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>
                          -{womacDelta} pts
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <button 
                          className="btn-outline" 
                          style={{ padding: '3px 7px', fontSize: '0.72rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right: Selected Patient Longitudinal Deep-Dive */}
        {selectedRecord ? (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--accent-cyan)' }}>
            
            {/* Header Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="brand-badge" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', marginBottom: 4, display: 'inline-block' }}>
                  {selectedRecord.id}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.3rem', color: '#fff' }}>{selectedRecord.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedRecord.age} Years Old • {selectedRecord.sex} • {selectedRecord.affectedKnee} Knee
                </p>
              </div>

              <span style={{ 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: 'var(--accent-emerald)', 
                border: '1px solid rgba(16, 185, 129, 0.3)', 
                padding: '3px 8px', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.72rem', 
                fontWeight: 700 
              }}>
                {selectedRecord.status}
              </span>
            </div>

            {/* Surgical Procedure & Implant Box */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                <Stethoscope size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Operative & Prosthetic Specifications</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Procedure Performed:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.procedure}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Implant System & Size:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{selectedRecord.implantUsed}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Attending Surgeon:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.surgeon}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Surgery Date:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.surgeryDate}</strong>
                </div>
              </div>
            </div>

            {/* Functional Outcome Comparison */}
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                Validated Functional Recovery Scores
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* WOMAC Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WOMAC Disability Score (Lower = Better)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{selectedRecord.postOpWOMAC1Yr}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>from {selectedRecord.preOpWOMAC}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    -{selectedRecord.preOpWOMAC - selectedRecord.postOpWOMAC1Yr} pts improvement
                  </span>
                </div>

                {/* Oxford Knee Score */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Oxford Knee Score (0-48, Higher = Better)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{selectedRecord.postOpOKS1Yr}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 48 (was {selectedRecord.preOpOKS})</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Excellent joint function
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Visit Notes */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                Clinical Recovery & Complications
              </span>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>
                {selectedRecord.complications}
              </p>
            </div>

            {/* Action to load into active analysis */}
            <div style={{ marginTop: '0.5rem' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const existing = currentPatients.find(p => p.name === selectedRecord.name || p.id === selectedRecord.id);
                  const patientToLoad = existing || createPatientFromHistoricalRecord(selectedRecord);
                  onSelectPatientForAnalysis(patientToLoad);
                }}
              >
                <Sparkles size={15} />
                <span>Load Into AI Segmentation & Sizing Suite</span>
              </button>
            </div>

          </div>
        ) : null}

      </div>

    </div>
  );
}
