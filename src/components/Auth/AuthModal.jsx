import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  Award,
  Stethoscope,
  Eye,
  EyeOff,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  Activity,
  X,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }) {
  const { user, login, register, demoLogin, dbStatus, refreshDbStatus } = useAuth();
  
  const [activeTab, setActiveTab] = useState(defaultTab); // 'signin' | 'register' | 'demo'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Surgeon',
    title: 'MD, FRCS (Ortho)',
    hospital: 'St. Jude Orthopedic & Arthroplasty Center',
    department: 'Adult Reconstruction & Joint Replacement',
    licenseNumber: '',
  });

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await login(signInData.email, signInData.password, rememberMe);
      setSuccessMsg('Authentication successful. Welcome back!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await register(registerData, rememberMe);
      setSuccessMsg('Physician account registered in MongoDB successfully!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSelect = async (profileKey) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await demoLogin(profileKey, true);
      setSuccessMsg(`Welcome, ${res.user.name}! Connected to MongoDB.`);
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 10000 }}>
      <div 
        className="auth-modal-card" 
        style={{
          width: '95%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 14, 26, 0.98))',
          borderRadius: '16px',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 242, 254, 0.2), 0 0 40px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'radial-gradient(ellipse at top, rgba(0, 242, 254, 0.08), transparent 70%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            }}>
              <Activity size={24} color="#0f172a" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
                  OrthoMorph AI
                </h3>
                <span className="brand-badge" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                  MongoDB Auth
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Surgical Intelligence & Morphometry Portal
              </p>
            </div>
          </div>

          {onClose && (
            <button 
              className="btn-icon" 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Live MongoDB Health Banner */}
        <div style={{
          padding: '0.65rem 1.75rem',
          background: dbStatus?.isConnected 
            ? 'rgba(16, 185, 129, 0.08)' 
            : 'rgba(245, 158, 11, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: dbStatus?.isConnected ? '#10b981' : '#f59e0b',
              boxShadow: dbStatus?.isConnected ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ color: dbStatus?.isConnected ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {dbStatus?.isConnected ? 'MongoDB Database Online' : 'Connecting to MongoDB...'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {dbStatus?.dbName || 'orthomorph_db'} ({dbStatus?.mode || 'Active'})
            </span>
          </div>

          <button 
            type="button"
            onClick={refreshDbStatus}
            title="Refresh database connection status"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Database size={12} />
            <span>Sync</span>
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '0.75rem 1.75rem 0',
          gap: '8px',
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '8px',
              border: activeTab === 'signin' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'signin' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              color: activeTab === 'signin' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '8px',
              border: activeTab === 'register' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'register' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              color: activeTab === 'register' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <UserPlus size={15} />
            <span>Register Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('demo'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '8px',
              border: activeTab === 'demo' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'demo' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              color: activeTab === 'demo' ? '#10b981' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={15} />
            <span>Quick Demo</span>
          </button>
        </div>

        {/* Feedback Messages */}
        <div style={{ padding: '0.75rem 1.75rem 0' }}>
          {errorMsg && (
            <div style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ padding: '1.25rem 1.75rem 1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Institutional Physician Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. alistair.sterling@stjude-ortho.org"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSignInData({
                      email: 'alistair.sterling@stjude-ortho.org',
                      password: 'OrthoMorphDemo2026!',
                    });
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Fill Demo Credentials
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your physician password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.4rem 0.65rem 2.4rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                Remember this workstation session
              </label>
              <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }} onClick={() => setActiveTab('demo')}>
                Need demo access?
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Verifying with MongoDB...' : 'Sign In to OrthoMorph'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Doctor Onboarding / Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} style={{ padding: '1.25rem 1.75rem 1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Full Physician Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Samantha Hayes"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Clinical Specialty / Role
                </label>
                <select
                  value={registerData.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    let title = 'MD, FRCS (Ortho)';
                    let dept = 'Adult Reconstruction & Joint Replacement';
                    if (role === 'Radiologist') {
                      title = 'MD, PhD (MSK Imaging)';
                      dept = 'Diagnostic Musculoskeletal Radiology';
                    } else if (role === 'Biostatistician') {
                      title = 'PhD, Biostatistics';
                      dept = 'Orthopedic Biomechanics & Population Analytics';
                    } else if (role === 'Orthopedic Fellow') {
                      title = 'MD, Arthroplasty Fellow';
                      dept = 'Joint Preservation & Reconstruction';
                    }
                    setRegisterData({ ...registerData, role, title, department: dept });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Surgeon">Orthopedic Surgeon</option>
                  <option value="Radiologist">MSK Radiologist</option>
                  <option value="Biostatistician">Biostatistician / Data Scientist</option>
                  <option value="Orthopedic Fellow">Arthroplasty Fellow</option>
                  <option value="Researcher">Clinical Researcher</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Institutional Email (Stored in MongoDB)
              </label>
              <input
                type="email"
                required
                placeholder="e.g. s.hayes@orthoclinic.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Hospital / Arthroplasty Center
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mayo Clinic / St. Jude"
                  value={registerData.hospital}
                  onChange={(e) => setRegisterData({ ...registerData, hospital: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Medical License ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. MED-89420-US"
                  value={registerData.licenseNumber}
                  onChange={(e) => setRegisterData({ ...registerData, licenseNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Secure Password (min 6 characters)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Choose a strong password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.7rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <UserPlus size={16} />
              <span>{isSubmitting ? 'Registering Physician...' : 'Create Account in MongoDB'}</span>
            </button>
          </form>
        )}

        {/* Tab 3: Quick Demo Credentials */}
        {activeTab === 'demo' && (
          <div style={{ padding: '1.25rem 1.75rem 1.5rem' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Select a pre-verified medical specialist profile to authenticate instantly against the MongoDB database without entering passwords:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Profile 1: Surgeon */}
              <div 
                onClick={() => handleDemoSelect('surgeon')}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                className="demo-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(0, 242, 254, 0.15)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}>
                    AS
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Dr. Alistair Sterling</span>
                      <span className="brand-badge" style={{ fontSize: '0.65rem' }}>Surgeon</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      MD, FRCS (Ortho) — Adult Knee Reconstruction
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn-outline" 
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                >
                  Sign In <ArrowRight size={12} style={{ marginLeft: 4 }} />
                </button>
              </div>

              {/* Profile 2: Radiologist */}
              <div 
                onClick={() => handleDemoSelect('radiologist')}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                className="demo-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}>
                    ER
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Dr. Elena Rostova</span>
                      <span className="brand-badge" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                        Radiology
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      MD, PhD — Musculoskeletal MRI & 3D Imaging
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn-outline" 
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#10b981', color: '#10b981' }}
                >
                  Sign In <ArrowRight size={12} style={{ marginLeft: 4 }} />
                </button>
              </div>

              {/* Profile 3: Biostatistician */}
              <div 
                onClick={() => handleDemoSelect('biostatistician')}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                className="demo-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}>
                    MC
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Dr. Marcus Chen</span>
                      <span className="brand-badge" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                        Biostats
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      PhD — Population Phenotyping & Cohort Analytics
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn-outline" 
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#f59e0b', color: '#f59e0b' }}
                >
                  Sign In <ArrowRight size={12} style={{ marginLeft: 4 }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{
          padding: '0.75rem 1.75rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} />
            <span>256-Bit Encrypted JWT & Mongoose ORM</span>
          </div>
          <span>HIPAA / GDPR Ready</span>
        </div>
      </div>
    </div>
  );
}
