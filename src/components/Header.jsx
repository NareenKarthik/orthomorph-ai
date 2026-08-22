import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Ruler, 
  BarChart3, 
  Cpu, 
  Box, 
  FileText, 
  Key, 
  Download, 
  UserCheck, 
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Upload,
  User,
  Database,
  LogOut,
  ChevronDown,
  Lock,
  Globe
} from 'lucide-react';
import { getStoredApiKey } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  patients, 
  activePatient, 
  setActivePatient, 
  openApiKeyModal,
  openUploadModal,
  openAuthModal,
  exportReport
}) {
  const hasApiKey = Boolean(getStoredApiKey());
  const { user, isAuthenticated, logout, dbStatus } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dicom', label: 'DICOM & MONAI AI', icon: Layers },
    { id: 'biodata', label: 'Patient Biodata', icon: UserCheck },
    { id: 'morphometry', label: 'Meniscus Morphometry', icon: Ruler },
    { id: 'implant', label: 'Implant Sizing', icon: Cpu },
    { id: 'biostats', label: 'Biostatistics Hub', icon: BarChart3 },
    { id: '3d-knee', label: '3D Joint & Implant', icon: Box },
    { id: 'dispatch', label: 'Global Surgical Dispatch', icon: Globe },
    { id: 'registry', label: 'Hospital Registry (EMR)', icon: Stethoscope },
    { id: 'report', label: 'Gemini AI Report', icon: FileText },
  ];

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="app-header">
      {/* Brand & Identity */}
      <div className="header-brand">
        <div className="brand-icon">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">OrthoMorph AI</span>
            <span className="brand-badge">v2.4 Pro</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
            Meniscus Thickness & Patient-Specific Knee Implant Sizing
          </p>
        </div>
      </div>

      {/* Patient Selector Context */}
      <div className="patient-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
          <UserCheck size={16} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Patient:</span>
        </div>
        <select 
          className="patient-select" 
          value={activePatient.id} 
          onChange={(e) => {
            const found = patients.find(p => p.id === e.target.value);
            if (found) setActivePatient(found);
          }}
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sex}, {p.age}y) — KL Grade {p.klGrade} [{p.affectedKnee} Knee]
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Live MongoDB Status Pill */}
        <div 
          onClick={openAuthModal}
          title={`MongoDB Status: ${dbStatus?.isConnected ? 'Connected (' + (dbStatus.mode || 'Active') + ')' : 'Connecting / Offline'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: `1px solid ${dbStatus?.isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: dbStatus?.isConnected ? '#10b981' : '#f59e0b',
            boxShadow: dbStatus?.isConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
          }} />
          <span style={{ color: dbStatus?.isConnected ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
            MongoDB
          </span>
        </div>

        {/* Upload Scan / Photo Button */}
        {openUploadModal && (
          <button 
            className="btn-outline btn-gemini"
            onClick={openUploadModal}
            title="Upload custom knee scan, MRI/CT, or medical photo"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Upload size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Upload Scan</span>
          </button>
        )}

        {/* Gemini API Key Trigger */}
        <button 
          className={`btn-outline ${hasApiKey ? 'btn-gemini' : ''}`}
          onClick={openApiKeyModal}
          title="Configure Google Gemini API Key for Live Orthopedic Reports"
          style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
        >
          <Key size={14} style={{ color: hasApiKey ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
          <span>{hasApiKey ? 'Gemini API Active' : 'Set Gemini Key'}</span>
          {hasApiKey && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />}
        </button>

        {/* Quick Export */}
        <button 
          className="btn-primary"
          onClick={exportReport}
          title="Export Patient Morphometrics & Surgical Plan"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
        >
          <Download size={14} />
          <span>Export Plan</span>
        </button>

        {/* Authenticated Physician Badge or Login Trigger */}
        {isAuthenticated && user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.35rem 0.75rem',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12), rgba(15, 23, 42, 0.8))',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                borderRadius: '24px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: user.avatarColor || '#00f2fe',
                color: '#0f172a',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {getInitials(user.name)}
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                  {user.name.replace(/^(Dr\.|Prof\.)\s*/i, '')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', lineHeight: 1 }}>
                  {user.role || 'Surgeon'}
                </span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '260px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,242,254,0.15)',
                  backdropFilter: 'blur(16px)',
                  padding: '12px',
                  zIndex: 9999,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{user.title || user.role}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {user.hospital || 'St. Jude Orthopedic & Arthroplasty Center'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ID: {user.licenseNumber || 'MED-98420-OR'}
                  </div>
                </div>

                <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>MongoDB Store:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Active & Synced</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>Database:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{dbStatus.dbName}</span>
                  </div>
                </div>

                <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      openAuthModal();
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 242, 254, 0.08)',
                      border: '1px solid rgba(0, 242, 254, 0.2)',
                      color: 'var(--accent-cyan)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={14} />
                    <span>Switch Doctor Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn-outline btn-gemini"
            onClick={openAuthModal}
            title="Sign in with your physician credentials or MongoDB account"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              borderColor: 'var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={14} />
            <span>Doctor Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

