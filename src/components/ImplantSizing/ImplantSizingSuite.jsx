import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Sliders, 
  FileCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { calculateFemoralSizing, calculateTibialSizing } from '../../services/implantSizingEngine';
import { IMPLANT_CATALOG } from '../../types/data';

export default function ImplantSizingSuite({ patient }) {
  const [selectedSystem, setSelectedSystem] = useState("Zimmer Persona");
  const [alignmentTarget, setAlignmentTarget] = useState("Kinematic Alignment (rKA)");

  const femurAP = patient.morphometrics.femur.apDimension;
  const femurML = patient.morphometrics.femur.mlDimension;
  const tibiaML = patient.morphometrics.tibia.mlDimension;
  const tibiaAP = patient.morphometrics.tibia.apDimension;
  const mmThick = patient.morphometrics.medialMeniscus.meanThickness;
  const jswMedial = patient.morphometrics.jointSpaceWidth.medialCompartment;

  // Compute live sizing
  const femoralMatch = useMemo(() => {
    return calculateFemoralSizing(femurAP, femurML, selectedSystem);
  }, [femurAP, femurML, selectedSystem]);

  const tibialMatch = useMemo(() => {
    return calculateTibialSizing(tibiaML, tibiaAP, mmThick, jswMedial);
  }, [tibiaML, tibiaAP, mmThick, jswMedial]);

  const catalogOptions = IMPLANT_CATALOG[selectedSystem] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Patient-Specific Implant Sizing Summary */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #00f2fe, #38bdf8)', 
            color: '#050b14', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Patient-Specific Knee Arthroplasty Sizing Suite</h3>
              <span className="brand-badge">Automated Fit Engine</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Prosthetic dimension matching derived from MONAI cortical bone segmentation contours
            </p>
          </div>
        </div>

        {/* System Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prosthesis:</span>
          <select 
            value={selectedSystem} 
            onChange={(e) => setSelectedSystem(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="Zimmer Persona">Zimmer Biomet Persona®</option>
            <option value="Stryker Triathlon">Stryker Triathlon®</option>
            <option value="DePuy Attune">DePuy Synthes ATTUNE®</option>
          </select>
        </div>
      </div>

      {/* 2 Primary Sizing Cards: Femoral Component & Tibial Component */}
      <div className="grid-2col">
        
        {/* Femoral Component Sizing */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                Femoral Sizing Match
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1.25rem', color: '#fff' }}>
                {femoralMatch ? femoralMatch.size : 'Calculating...'}
              </h4>
            </div>
            <span style={{ 
              background: femoralMatch?.alertVariant === 'danger' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)',
              color: femoralMatch?.alertVariant === 'danger' ? 'var(--accent-rose)' : 'var(--accent-emerald)',
              border: `1px solid ${femoralMatch?.alertVariant === 'danger' ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.4)'}`,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {femoralMatch?.fitSafety}
            </span>
          </div>

          {/* Morphometric Dimensions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Patient AP</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {femurAP} mm
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Implant: {femoralMatch?.implantAP}mm</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Patient ML</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {femurML} mm
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Implant: {femoralMatch?.implantML}mm</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ML Margin</span>
              <div style={{ 
                fontSize: '1.15rem', 
                fontWeight: 800, 
                color: femoralMatch?.mlOverhang > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)', 
                fontFamily: 'var(--font-mono)' 
              }}>
                {femoralMatch?.mlOverhang > 0 ? `+${femoralMatch?.mlOverhang}` : femoralMatch?.mlOverhang} mm
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {femoralMatch?.mlOverhang <= 0 ? 'Safe Underhang' : 'Overhang Risk'}
              </span>
            </div>
          </div>

          {/* Resection Parameters */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Distal Medial Resection Target:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{patient.morphometrics.femur.distalMedialResectionTarget} mm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Distal Lateral Resection Target:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{patient.morphometrics.femur.distalLateralResectionTarget} mm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Posterior Condylar External Rotation:</span>
              <strong style={{ color: '#fff' }}>{patient.morphometrics.femur.posteriorCondyleAngle}</strong>
            </div>
          </div>
        </div>

        {/* Tibial Tray & Polyethylene Sizing */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                Tibial Tray & Insert Sizing
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1.25rem', color: '#fff' }}>
                {tibialMatch.traySize} Tray + {tibialMatch.recommendedPoly} Poly
              </h4>
            </div>
            <span style={{ 
              background: 'rgba(16,185,129,0.2)',
              color: 'var(--accent-emerald)',
              border: '1px solid rgba(16,185,129,0.4)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {tibialMatch.coveragePercent} Bone Coverage
            </span>
          </div>

          {/* Morphometric Dimensions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tibial Plateau ML</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {tibiaML} mm
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tray ML: {tibialMatch.implantML}mm</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tibial Plateau AP</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {tibiaAP} mm
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tray AP: {tibialMatch.implantAP}mm</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Poly Spacer</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {tibialMatch.recommendedPoly}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Meniscal Gap Restored</span>
            </div>
          </div>

          {/* Bone Defect & Alignment Notes */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Medial Tibial Defect Depth:</span>
              <strong style={{ color: patient.morphometrics.tibia.medialBoneDefectDepth > 3.0 ? 'var(--accent-rose)' : '#fff' }}>
                {patient.morphometrics.tibia.medialBoneDefectDepth} mm {patient.morphometrics.tibia.medialBoneDefectDepth > 3.0 ? '(Requires Augment)' : ''}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Posterior Tibial Slope:</span>
              <strong style={{ color: '#fff' }}>{patient.morphometrics.tibia.medialSlope}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Alignment Strategy:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>{patient.implantRecommendation.alignmentStrategy}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Manufacturer Sizing Catalog Matrix */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedSystem} Component Sizing Matrix</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Active patient fit highlighted in cyan with millimeter precision
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 12px' }}>Implant Size</th>
                <th style={{ padding: '8px 12px' }}>Anteroposterior (AP)</th>
                <th style={{ padding: '8px 12px' }}>Mediolateral Standard</th>
                <th style={{ padding: '8px 12px' }}>Mediolateral Narrow</th>
                <th style={{ padding: '8px 12px' }}>Patient AP Delta</th>
                <th style={{ padding: '8px 12px' }}>Patient ML Delta</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {catalogOptions.map(item => {
                const isCurrentMatch = femoralMatch?.rawSize === item.size;
                const apDiff = +(item.ap - femurAP).toFixed(1);
                const mlDiff = +(item.mlStandard - femurML).toFixed(1);

                return (
                  <tr 
                    key={item.size} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      background: isCurrentMatch ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                      borderLeft: isCurrentMatch ? '3px solid var(--accent-cyan)' : '3px solid transparent'
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontWeight: isCurrentMatch ? 700 : 500, color: isCurrentMatch ? 'var(--accent-cyan)' : '#fff' }}>
                      {item.size}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{item.ap} mm</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{item.mlStandard} mm</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{item.mlNarrow ? `${item.mlNarrow} mm` : 'N/A'}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: Math.abs(apDiff) < 1.5 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {apDiff > 0 ? `+${apDiff}` : apDiff} mm
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: Math.abs(mlDiff) < 2.0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {mlDiff > 0 ? `+${mlDiff}` : mlDiff} mm
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {isCurrentMatch ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          <CheckCircle2 size={13} /> Selected Fit
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Available</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
