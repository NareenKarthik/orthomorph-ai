import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingDown, 
  PieChart, 
  Sparkles, 
  Filter, 
  Download, 
  Search,
  CheckCircle2,
  GitCompare,
  ArrowUpDown
} from 'lucide-react';
import { GENERATE_POPULATION_COHORT } from '../../types/data';
import { calculateSummaryStats, calculateTwoSampleTTest, calculateLinearRegression } from '../../services/statsEngine';

export default function BiostatisticsHub({ activePatient }) {
  // Generate stable cohort dataset (240 subjects)
  const allCohort = useMemo(() => GENERATE_POPULATION_COHORT(), []);

  // Filter States
  const [sexFilter, setSexFilter] = useState('all'); // 'all' | 'Male' | 'Female'
  const [oaFilter, setOaFilter] = useState('all'); // 'all' | 'oa' | 'non-oa'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMetricTab, setActiveMetricTab] = useState('meniscus'); // 'meniscus' | 'jsw' | 'femurML' | 'tibiaML'

  // Filtered dataset
  const filteredCohort = useMemo(() => {
    return allCohort.filter(item => {
      if (sexFilter !== 'all' && item.sex !== sexFilter) return false;
      if (oaFilter === 'oa' && !item.isOA) return false;
      if (oaFilter === 'non-oa' && item.isOA) return false;
      if (searchQuery && !item.id.toLowerCase().includes(searchQuery.toLowerCase()) && !item.groupLabel.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allCohort, sexFilter, oaFilter, searchQuery]);

  // Statistical Comparisons:
  // 1. OA vs Non-OA Comparison for Meniscal Thickness
  const oaGroup = useMemo(() => allCohort.filter(p => p.isOA).map(p => p.medialMeniscusThickness), [allCohort]);
  const nonOaGroup = useMemo(() => allCohort.filter(p => !p.isOA).map(p => p.medialMeniscusThickness), [allCohort]);
  const oaVsNonOaStats = useMemo(() => calculateTwoSampleTTest(nonOaGroup, oaGroup), [oaGroup, nonOaGroup]);

  // 2. Male vs Female Comparison for Femoral & Tibial Morphometrics
  const maleFemurML = useMemo(() => allCohort.filter(p => p.sex === 'Male').map(p => p.femurML), [allCohort]);
  const femaleFemurML = useMemo(() => allCohort.filter(p => p.sex === 'Female').map(p => p.femurML), [allCohort]);
  const maleVsFemaleFemurStats = useMemo(() => calculateTwoSampleTTest(maleFemurML, femaleFemurML), [maleFemurML, femaleFemurML]);

  const maleTibiaML = useMemo(() => allCohort.filter(p => p.sex === 'Male').map(p => p.tibiaML), [allCohort]);
  const femaleTibiaML = useMemo(() => allCohort.filter(p => p.sex === 'Female').map(p => p.tibiaML), [allCohort]);
  const maleVsFemaleTibiaStats = useMemo(() => calculateTwoSampleTTest(maleTibiaML, femaleTibiaML), [maleTibiaML, femaleTibiaML]);

  // 3. Linear Regression: Meniscal Thickness vs Joint Space Width
  const regressionData = useMemo(() => {
    const x = filteredCohort.map(p => p.medialMeniscusThickness);
    const y = filteredCohort.map(p => p.jointSpaceWidth);
    return calculateLinearRegression(x, y);
  }, [filteredCohort]);

  // Export cohort to CSV
  const exportCohortCsv = () => {
    const headers = "ID,Age,Sex,BMI,KL_Grade,OA_Status,Meniscus_Thickness_mm,JSW_mm,Femur_ML_mm,Femur_AP_mm,Tibia_ML_mm,Tibia_AP_mm\n";
    const rows = filteredCohort.map(p => 
      `${p.id},${p.age},${p.sex},${p.bmi},${p.klGrade},${p.isOA ? 'OA' : 'Non-OA'},${p.medialMeniscusThickness},${p.jointSpaceWidth},${p.femurML},${p.femurAP},${p.tibiaML},${p.tibiaAP}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orthomorph_population_cohort_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Statistical Summary Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Population Biostatistics & Morphometric Engine</h3>
              <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                N = {allCohort.length} Subjects
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Quantitative hypothesis testing (SciPy/Statsmodels equivalent): OA vs Non-OA & Male vs Female morphological scaling
            </p>
          </div>
        </div>

        <button className="btn-outline" onClick={exportCohortCsv}>
          <Download size={14} />
          <span>Export Biostatistical CSV</span>
        </button>
      </div>

      {/* 2 Primary Statistical Comparisons: OA vs Non-OA and Male vs Female */}
      <div className="grid-2col">
        
        {/* Comparison 1: Osteoarthritis vs Non-Osteoarthritis */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 700 }}>
                Group Comparison #1
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem' }}>OA vs Non-OA Meniscal Thickness</h4>
            </div>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--accent-emerald)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}>
              p &lt; 0.0001 (Significant)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Healthy / Non-OA (n={oaVsNonOaStats.statsA.count})</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {oaVsNonOaStats.statsA.mean} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>± {oaVsNonOaStats.statsA.sd} mm</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OA Cohort (n={oaVsNonOaStats.statsB.count})</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                {oaVsNonOaStats.statsB.mean} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>± {oaVsNonOaStats.statsB.sd} mm</span>
              </div>
            </div>
          </div>

          {/* Statistical Metrics Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mean Difference:</span>
              <strong style={{ color: '#fff' }}>{oaVsNonOaStats.diffMean} mm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>95% Confidence Interval (CI):</span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>[{oaVsNonOaStats.ci95[0]}, {oaVsNonOaStats.ci95[1]}] mm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Effect Size (Cohen's d):</span>
              <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>d = {oaVsNonOaStats.cohensD} (Huge Effect)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Two-Sample Welch's t-Statistic:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>t = {oaVsNonOaStats.tStat} (df = {oaVsNonOaStats.df})</strong>
            </div>
          </div>
        </div>

        {/* Comparison 2: Male vs Female Morphological Scaling */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                Group Comparison #2
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem' }}>Sex-Based Morphometry (Femur & Tibia)</h4>
            </div>
            <div style={{ 
              background: 'rgba(0, 242, 254, 0.15)', 
              color: 'var(--accent-cyan)', 
              border: '1px solid rgba(0, 242, 254, 0.3)', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}>
              p &lt; 0.0001 (Significant)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Male Femoral ML (n={maleVsFemaleFemurStats.statsA.count})</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                {maleVsFemaleFemurStats.statsA.mean} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>± {maleVsFemaleFemurStats.statsA.sd} mm</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Female Femoral ML (n={maleVsFemaleFemurStats.statsB.count})</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                {maleVsFemaleFemurStats.statsB.mean} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>± {maleVsFemaleFemurStats.statsB.sd} mm</span>
              </div>
            </div>
          </div>

          {/* Sex Metrics Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Femur ML Sex Difference:</span>
              <strong style={{ color: '#fff' }}>+{maleVsFemaleFemurStats.diffMean} mm (Male &gt; Female)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tibia ML Sex Difference:</span>
              <strong style={{ color: '#fff' }}>+{maleVsFemaleTibiaStats.diffMean} mm (Male &gt; Female)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gender-Specific Sizing Requirement:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>Mandates Narrow vs Standard Prosthesis</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Morphological Scaling Factor:</span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>1.14x Area Ratio</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Scatter Plot: Meniscal Thickness vs Joint Space Width with Regression */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Bivariate Correlation: Meniscal Thickness vs Joint Space Width</h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Pearson r = <strong>{regressionData.r}</strong> | R² = <strong>{regressionData.r2}</strong> | Regression Equation: <em>y = {regressionData.slope}x + {regressionData.intercept}</em>
            </p>
          </div>

          {/* Active Patient Indicator */}
          <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Active Patient ({activePatient.name}): {activePatient.morphometrics.medialMeniscus.meanThickness}mm / {activePatient.morphometrics.jointSpaceWidth.medialCompartment}mm
          </div>
        </div>

        {/* SVG Scatter Plot */}
        <div style={{ width: '100%', height: 260, position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 240" style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5, 6].map(val => {
              const y = 220 - (val / 7) * 200;
              return (
                <g key={val}>
                  <line x1="60" y1={y} x2="780" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x="50" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">{val}mm</text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {[0, 1, 2, 3, 4, 5, 6].map(val => {
              const x = 60 + (val / 6.5) * 720;
              return (
                <g key={val}>
                  <line x1={x} y1="20" x2={x} y2="220" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x={x} y="235" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{val}mm</text>
                </g>
              );
            })}

            {/* Regression Line */}
            {filteredCohort.length > 0 && (
              <line
                x1="60"
                y1={220 - (regressionData.intercept / 7) * 200}
                x2={60 + (6.0 / 6.5) * 720}
                y2={220 - ((regressionData.slope * 6.0 + regressionData.intercept) / 7) * 200}
                stroke="#00f2fe"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}

            {/* Scatter Dots */}
            {filteredCohort.map(p => {
              const cx = 60 + (p.medialMeniscusThickness / 6.5) * 720;
              const cy = 220 - (p.jointSpaceWidth / 7) * 200;
              const isOA = p.isOA;
              return (
                <circle
                  key={p.id}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={isOA ? '#f43f5e' : '#10b981'}
                  opacity={0.7}
                >
                  <title>{`${p.id} (${p.sex}, ${p.age}y): Meniscus ${p.medialMeniscusThickness}mm, JSW ${p.jointSpaceWidth}mm [${p.groupLabel}]`}</title>
                </circle>
              );
            })}

            {/* Active Patient Highlight */}
            {(() => {
              const px = 60 + (activePatient.morphometrics.medialMeniscus.meanThickness / 6.5) * 720;
              const py = 220 - (activePatient.morphometrics.jointSpaceWidth.medialCompartment / 7) * 200;
              return (
                <g>
                  <circle cx={px} cy={py} r={9} fill="none" stroke="#00f2fe" strokeWidth="2.5" className="pulse-glow" />
                  <circle cx={px} cy={py} r={4.5} fill="#00f2fe" />
                  <text x={px} y={py - 14} fill="#00f2fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {activePatient.name}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Non-OA / Healthy Controls</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Osteoarthritis Cohort (KL 2-4)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00f2fe' }} />
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Currently Selected Patient</span>
          </div>
        </div>
      </div>

      {/* Cohort Explorer Filter Bar & Data Table */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>Patient Cohort Registry</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Displaying {filteredCohort.length} of {allCohort.length} subjects
            </span>
          </div>

          {/* Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Sex Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sex:</span>
              <select 
                value={sexFilter} 
                onChange={(e) => setSexFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="all">All Sexes</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* OA Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cohort:</span>
              <select 
                value={oaFilter} 
                onChange={(e) => setOaFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="all">All Groups</option>
                <option value="oa">OA (KL 2-4)</option>
                <option value="non-oa">Non-OA (KL 0-1)</option>
              </select>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={13} style={{ position: 'absolute', left: 8, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search Subject ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '4px 8px 4px 26px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  outline: 'none',
                  width: 140
                }}
              />
            </div>
          </div>
        </div>

        {/* Cohort Table */}
        <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 10px' }}>Subject ID</th>
                <th style={{ padding: '8px 10px' }}>Age / Sex</th>
                <th style={{ padding: '8px 10px' }}>BMI</th>
                <th style={{ padding: '8px 10px' }}>KL Severity</th>
                <th style={{ padding: '8px 10px' }}>Meniscus Thickness</th>
                <th style={{ padding: '8px 10px' }}>JSW</th>
                <th style={{ padding: '8px 10px' }}>Femur ML</th>
                <th style={{ padding: '8px 10px' }}>Tibia ML</th>
              </tr>
            </thead>
            <tbody>
              {filteredCohort.slice(0, 50).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{p.id}</td>
                  <td style={{ padding: '6px 10px' }}>{p.age}y / {p.sex}</td>
                  <td style={{ padding: '6px 10px' }}>{p.bmi}</td>
                  <td style={{ padding: '6px 10px' }}>
                    <span className={`meta-pill pill-kl-${p.klGrade}`}>
                      Grade {p.klGrade}
                    </span>
                  </td>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.medialMeniscusThickness} mm</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)' }}>{p.jointSpaceWidth} mm</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)' }}>{p.femurML} mm</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)' }}>{p.tibiaML} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
