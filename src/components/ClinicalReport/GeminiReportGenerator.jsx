import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  RefreshCw, 
  Key, 
  AlertCircle, 
  ShieldCheck,
  Send,
  Cpu,
  BookmarkPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateClinicalReport, getStoredApiKey, getStoredModel } from '../../services/geminiService';

export default function GeminiReportGenerator({ patient, openApiKeyModal }) {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const hasApiKey = Boolean(getStoredApiKey());
  const activeModel = getStoredModel();

  // Load report on mount or when patient changes
  useEffect(() => {
    handleGenerate();
  }, [patient]);

  const handleGenerate = async (customText = '') => {
    setIsLoading(true);
    try {
      const result = await generateClinicalReport(patient, customText);
      setReportData(result);
      // Trigger subtle celebration confetti on successful report generation
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#6366f1', '#10b981']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!reportData) return;
    navigator.clipboard.writeText(reportData.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!reportData) return;
    const dicomSr = {
      sopClassUID: "1.2.840.10008.5.1.4.1.1.88.22", // DICOM Comprehensive SR
      patientID: patient.id,
      patientName: patient.name,
      modality: "SR",
      software: "OrthoMorph AI v2.4 (MONAI + Gemini Core)",
      aiModel: reportData.model,
      generationTimestamp: reportData.timestamp,
      morphometrics: patient.morphometrics,
      implantPlan: patient.implantRecommendation,
      clinicalSummaryMarkdown: reportData.markdown
    };
    const blob = new Blob([JSON.stringify(dicomSr, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DICOM_SR_${patient.id}_${Date.now()}.json`;
    a.click();
  };

  const quickPrompts = [
    "Assess UKA (Partial) vs TKA (Total) Candidacy",
    "Evaluate Medial Tibial Plateau Bone Defect Management",
    "Generate Insurance Pre-Authorization Letter (ICD-10 & CPT)",
    "Kinematic Alignment (rKA) vs Mechanical Alignment Protocol"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.35)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Gemini AI Clinical & Surgical Planning Report</h3>
              <button 
                onClick={openApiKeyModal}
                style={{
                  background: hasApiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                  color: hasApiKey ? 'var(--accent-emerald)' : '#a5b4fc',
                  border: `1px solid ${hasApiKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(168, 85, 247, 0.5)'}`,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
                title="Click to enter or change Google Gemini API Key"
              >
                <Key size={13} style={{ color: hasApiKey ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
                <span>{hasApiKey ? `Live: ${activeModel}` : '🔑 Click to Enter Gemini API Key'}</span>
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Synthesizes quantitative MONAI measurements into a structured, board-level orthopedic radiology & arthroplasty summary
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-outline btn-gemini"
            onClick={openApiKeyModal}
            title="Configure Google Gemini API Key"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: 700 }}
          >
            <Key size={14} style={{ color: hasApiKey ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
            <span>{hasApiKey ? 'API Key Active' : 'Set Gemini Key'}</span>
          </button>
          <button 
            className="btn-outline"
            onClick={handleCopy}
            title="Copy Report to Clipboard"
          >
            {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button 
            className="btn-outline"
            onClick={handlePrint}
            title="Print Official Clinical Report"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          <button 
            className="btn-outline"
            onClick={handleExportJson}
            title="Export DICOM-SR Standard JSON"
          >
            <Download size={14} />
            <span>DICOM-SR JSON</span>
          </button>

          <button 
            className="btn-primary"
            onClick={() => handleGenerate(customPrompt)}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Generating AI Report...' : 'Re-Generate'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Custom Prompt Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Instruct Gemini AI (e.g. Focus on post-op rehabilitation protocol or UKA suitability)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerate(customPrompt);
            }}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button 
            className="btn-gemini" 
            onClick={() => handleGenerate(customPrompt)}
            disabled={isLoading}
            style={{ padding: '0.65rem 1.1rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, cursor: 'pointer' }}
          >
            <Send size={14} />
            <span>Prompt AI</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Prompts:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomPrompt(qp);
                handleGenerate(qp);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content Card */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', background: '#0b101d', border: '1px solid var(--border-subtle)' }}>
        
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: '1rem' }}>
            <div style={{ 
              width: 54, 
              height: 54, 
              borderRadius: '50%', 
              border: '3px solid rgba(0, 242, 254, 0.15)', 
              borderTopColor: 'var(--accent-cyan)',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Synthesizing Orthopedic Clinical Report</h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Processing MONAI 3D morphometrics, meniscus measurements, and implant sizing catalog...
              </p>
            </div>
          </div>
        ) : reportData ? (
          <div className="markdown-report">
            {renderMarkdown(reportData.markdown)}
          </div>
        ) : null}

      </div>

    </div>
  );
}

// Simple yet robust Markdown Renderer for Medical Reports
function renderMarkdown(md) {
  if (!md) return null;
  const lines = md.split('\n');

  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {listItems.map((li, idx) => (
            <li key={idx} style={{ marginBottom: '0.35rem' }} dangerouslySetInnerHTML={{ __html: formatInline(li) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={idx} style={{ color: 'var(--accent-cyan)', fontSize: '1.45rem', marginTop: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0,242,254,0.2)', paddingBottom: '0.4rem' }}>{trimmed.replace('# ', '')}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={idx} style={{ color: '#fff', fontSize: '1.15rem', marginTop: '1.5rem', marginBottom: '0.65rem' }}>{trimmed.replace('## ', '')}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={idx} style={{ color: 'var(--accent-indigo)', fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={idx} style={{ borderLeft: '3px solid var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.05)', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0', margin: '1rem 0', fontStyle: 'italic', color: '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace('> ', '')) }} />
      );
    } else if (trimmed.startsWith('---')) {
      flushList();
      elements.push(<hr key={idx} style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }} />);
    } else if (trimmed.length > 0) {
      flushList();
      elements.push(<p key={idx} style={{ marginBottom: '0.85rem', color: '#cbd5e1' }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />);
    }
  });

  flushList();
  return elements;
}

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff; font-weight: 700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="font-family: JetBrains Mono, monospace; background: rgba(0, 242, 254, 0.1); color: #00f2fe; padding: 2px 5px; border-radius: 4px; font-size: 0.85em;">$1</code>');
}
