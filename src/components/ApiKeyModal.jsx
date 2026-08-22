import React, { useState } from 'react';
import { 
  Key, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  X, 
  Loader2,
  Lock,
  Cpu
} from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel, 
  AVAILABLE_MODELS, 
  testGeminiApiKey 
} from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [latencyMs, setLatencyMs] = useState(0);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setStoredModel(selectedModel);
    if (onKeyUpdated) onKeyUpdated();
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestStatus(null);
    setErrorMessage('');
    if (onKeyUpdated) onKeyUpdated();
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setErrorMessage('Please enter an API key first.');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');
    const startTime = performance.now();

    const res = await testGeminiApiKey(apiKey.trim(), selectedModel);
    const duration = Math.round(performance.now() - startTime);
    setLatencyMs(duration);

    if (res.success) {
      setTestStatus('success');
    } else {
      setTestStatus('error');
      setErrorMessage(res.error || 'Failed to authenticate with Gemini API.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Google Gemini API Configuration</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Power real-time orthopedic radiology & surgical planning AI reports
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

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Gemini API Key
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus(null);
                }}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Key is stored strictly inside browser <code className="font-mono">localStorage</code>.
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                Get a free Gemini API Key <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Gemini Model Engine
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {AVAILABLE_MODELS.map(m => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    style={{
                      padding: '0.75rem',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Cpu size={14} style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{m.id}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Connection Banner */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testStatus === 'testing'}
                className="btn-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
              >
                {testStatus === 'testing' ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <span>Test Connection</span>
                )}
              </button>

              {testStatus === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)', fontSize: '0.82rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Authenticated Successfully ({latencyMs}ms)</span>
                </div>
              )}

              {testStatus === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-rose)', fontSize: '0.82rem' }}>
                  <XCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {testStatus === null && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click to verify quota & key validity.
                </span>
              )}
            </div>

            {apiKey && (
              <button 
                onClick={handleClear}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Remove Key
              </button>
            )}
          </div>

          {/* Fallback Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem'
          }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Zero Key Lockout:</strong> If you do not have a Gemini API key yet, the application automatically employs our built-in <em>OrthoMorph Expert Clinical Rule-Engine</em> with zero latency, generating comprehensive surgical reports and morphometric breakdowns.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          background: 'rgba(9, 14, 26, 0.8)'
        }}>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
}
