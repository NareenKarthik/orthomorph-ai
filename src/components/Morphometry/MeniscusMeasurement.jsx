import React from 'react';
import { 
  Ruler, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Layers, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';

export default function MeniscusMeasurement({ patient }) {
  const mm = patient.morphometrics.medialMeniscus;
  const lm = patient.morphometrics.lateralMeniscus;
  const jsw = patient.morphometrics.jointSpaceWidth;
  const cart = patient.morphometrics.cartilage;

  // Normative Healthy Baselines
  const normative = {
    anteriorHorn: 4.8,
    body: 5.2,
    posteriorHorn: 5.6,
    meanThickness: 5.2,
    jswMedial: 5.8,
    jswLateral: 6.0,
    extrusionMax: 2.0,
  };

  const antLoss = +(((normative.anteriorHorn - mm.anteriorHorn) / normative.anteriorHorn) * 100).toFixed(0);
  const bodyLoss = +(((normative.body - mm.body) / normative.body) * 100).toFixed(0);
  const postLoss = +(((normative.posteriorHorn - mm.posteriorHorn) / normative.posteriorHorn) * 100).toFixed(0);
  const meanLoss = +(((normative.meanThickness - mm.meanThickness) / normative.meanThickness) * 100).toFixed(0);

  const isExtrusionHigh = mm.extrusionDistance > 3.0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Meniscal Pathology Status */}
      <div className="glass-panel" style={{ 
        padding: '1.25rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderLeft: `4px solid ${patient.klGrade >= 3 ? 'var(--accent-rose)' : patient.klGrade === 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 'var(--radius-md)', 
            background: patient.klGrade >= 3 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: patient.klGrade >= 3 ? 'var(--accent-rose)' : 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Ruler size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Medial Meniscus Morphometric Profile</h3>
              <span className={`meta-pill pill-kl-${patient.klGrade}`}>
                KL Grade {patient.klGrade}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {mm.status}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume Loss Index</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: meanLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              {meanLoss > 0 ? `-${meanLoss}%` : '0% (Normative)'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coronal Extrusion</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isExtrusionHigh ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
              {mm.extrusionDistance} mm
            </div>
          </div>
        </div>
      </div>

      {/* 3 Anatomical Zones: Anterior Horn, Central Body, Posterior Horn */}
      <div className="grid-3col">
        
        {/* Anterior Horn */}
        <div className="glass-panel kpi-card amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-title">Anterior Horn Height</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Norm: 4.8mm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.25rem' }}>
            <span className="kpi-number">{mm.anteriorHorn}</span>
            <span className="kpi-unit">mm</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Residual Height</span>
              <span style={{ color: antLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                {100 - antLoss}%
              </span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, 100 - antLoss)}%`, height: '100%', background: antLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-amber)' }} />
            </div>
          </div>
        </div>

        {/* Central Body */}
        <div className="glass-panel kpi-card amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-title">Central Body Height</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Norm: 5.2mm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.25rem' }}>
            <span className="kpi-number">{mm.body}</span>
            <span className="kpi-unit">mm</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Residual Height</span>
              <span style={{ color: bodyLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                {100 - bodyLoss}%
              </span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, 100 - bodyLoss)}%`, height: '100%', background: bodyLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-amber)' }} />
            </div>
          </div>
        </div>

        {/* Posterior Horn */}
        <div className="glass-panel kpi-card amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-title">Posterior Horn Height</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Norm: 5.6mm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.25rem' }}>
            <span className="kpi-number">{mm.posteriorHorn}</span>
            <span className="kpi-unit">mm</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Residual Height</span>
              <span style={{ color: postLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                {100 - postLoss}%
              </span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, 100 - postLoss)}%`, height: '100%', background: postLoss > 50 ? 'var(--accent-rose)' : 'var(--accent-amber)' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Compartment Comparison: Medial vs Lateral Joint Space & Cartilage */}
      <div className="grid-2col">
        
        {/* Joint Space Width Compartment Analysis */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Tibiofemoral Joint Space Width (JSW)</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Medial JSW */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Medial Compartment JSW (Affected)</span>
                <strong style={{ color: jsw.medialCompartment < 2.0 ? 'var(--accent-rose)' : 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {jsw.medialCompartment} mm
                </strong>
              </div>
              <div style={{ width: '100%', height: 10, background: '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (jsw.medialCompartment / 6.0) * 100)}%`, height: '100%', background: jsw.medialCompartment < 2.0 ? 'var(--accent-rose)' : 'var(--accent-cyan)' }} />
              </div>
            </div>

            {/* Lateral JSW */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Lateral Compartment JSW (Preserved)</span>
                <strong style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                  {jsw.lateralCompartment} mm
                </strong>
              </div>
              <div style={{ width: '100%', height: 10, background: '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (jsw.lateralCompartment / 6.0) * 100)}%`, height: '100%', background: 'var(--accent-purple)' }} />
              </div>
            </div>

            {/* JSW Ratio */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>JSW Asymmetry Ratio</span>
                <span style={{ fontSize: '0.82rem', color: '#fff' }}>Medial / Lateral Width Index</span>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: jsw.jswRatio < 0.4 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {jsw.jswRatio}
              </span>
            </div>
          </div>
        </div>

        {/* Hyaline Cartilage Thickness Map */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={16} style={{ color: 'var(--accent-blue)' }} />
            <span>Subchondral Hyaline Cartilage Depth</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Medial Femoral</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cart.medialFemoralThickness < 1.0 ? 'var(--accent-rose)' : '#fff', fontFamily: 'var(--font-mono)' }}>
                {cart.medialFemoralThickness} mm
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Norm: 2.8 ± 0.4 mm</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lateral Femoral</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {cart.lateralFemoralThickness} mm
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Norm: 2.9 ± 0.4 mm</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Medial Tibial</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cart.medialTibialThickness < 0.8 ? 'var(--accent-rose)' : '#fff', fontFamily: 'var(--font-mono)' }}>
                {cart.medialTibialThickness} mm
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Norm: 2.4 ± 0.3 mm</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lateral Tibial</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {cart.lateralTibialThickness} mm
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Norm: 2.5 ± 0.3 mm</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pathological Clinical Guidance Box */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={18} style={{ color: 'var(--accent-indigo)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Orthopedic Biomechanical Insight:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Meniscal extrusion of <strong>{mm.extrusionDistance} mm</strong> compromises circumferential hoop tension, transferring up to 300% increased peak contact stress directly onto the subchondral bone of the medial tibial plateau. When medial meniscal thickness degrades below 2.0 mm, progressive varus malalignment accelerates joint space collapse.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
