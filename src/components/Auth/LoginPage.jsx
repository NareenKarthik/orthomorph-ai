import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  LogIn,
  Layers,
  Cpu,
  FileText,
  Clock,
  RefreshCw,
  Fingerprint,
  Globe,
  Package,
  Heart,
  Calendar,
  Phone,
  Droplet,
  Ruler,
  Weight,
  Stethoscope,
  Plane
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES_CONFIG, SURGICAL_ELEMENTS } from '../Dispatch/InternationalDispatchHub';

export default function LoginPage() {
  const {
    login,
    register,
    patientRegister,
    demoLogin,
    twoFactorState,
    verify2FA,
    resend2FA,
    cancel2FA,
    dbStatus,
    refreshDbStatus,
  } = useAuth();

  // Portal Mode: 'doctor' | 'patient'
  const [portalMode, setPortalMode] = useState('patient'); // default to patient intake as requested by user

  // Tab State for Step 1
  const [activeTab, setActiveTab] = useState('biodata'); // 'biodata' | 'patient-demo' | 'signin' | 'doctor-demo' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 6-Digit OTP inputs state for Step 2
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);
  const [resendTimer, setResendTimer] = useState(45);

  // Doctor Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Doctor Register Form State
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

  // Patient Intake Biodata & Country Dispatch State
  const [patientBiodata, setPatientBiodata] = useState({
    name: '',
    email: '',
    password: '',
    age: '62',
    sex: 'Female',
    heightCm: '168',
    weightKg: '74',
    bloodGroup: 'O+',
    affectedKnee: 'Right',
    klGrade: '4',
    diagnosis: 'End-Stage Medial Compartment Knee Osteoarthritis',
    country: 'Germany',
    destinationHospital: 'Charité - Universitätsmedizin Berlin',
    dispatchedElement: 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
    allergies: 'Penicillin (Mild Rash)',
    previousSurgeries: 'Right knee arthroscopy (2021)',
    contactPhone: '+1 (555) 234-8920',
  });

  // Auto-calculated BMI
  const calculatedBMI = Number(
    (Number(patientBiodata.weightKg) / Math.pow(Number(patientBiodata.heightCm) / 100, 2)).toFixed(1)
  ) || 26.2;

  // 2FA Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (twoFactorState.isPending && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [twoFactorState.isPending, resendTimer]);

  // Focus first OTP field when entering Step 2
  useEffect(() => {
    if (twoFactorState.isPending && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [twoFactorState.isPending]);

  // Handle Step 1: Doctor / Patient Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await login(signInData.email, signInData.password, rememberMe);
      if (res.require2FA) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(45);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 1: Patient Biodata & Dispatch Registration
  const handlePatientIntakeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!patientBiodata.name || !patientBiodata.email) {
      setErrorMsg('Please provide patient name and contact email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await patientRegister(patientBiodata, rememberMe);
      if (res.require2FA) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(45);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Patient biodata intake failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 1: Doctor Registration
  const handleDoctorRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await register(registerData, rememberMe);
      if (res.require2FA) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(45);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 1: Quick Demo Specialist Login
  const handleDemoSelect = async (profileKey) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await demoLogin(profileKey, true);
      if (res.require2FA) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(45);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 1: Quick Demo Patient Intake (Eleanor Vance or Arthur Pendelton)
  const handleDemoPatientSelect = (demoType) => {
    if (demoType === 'eleanor') {
      setPatientBiodata({
        name: 'Eleanor Vance',
        email: 'eleanor.vance@patient-portal.org',
        password: 'PatientSecure2026!',
        age: '67',
        sex: 'Female',
        heightCm: '165',
        weightKg: '80',
        bloodGroup: 'A+',
        affectedKnee: 'Right',
        klGrade: '4',
        diagnosis: 'End-Stage Medial OA with Varus Deformity',
        country: 'Germany',
        destinationHospital: 'Charité - Universitätsmedizin Berlin',
        dispatchedElement: 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
        allergies: 'Penicillin (Mild Rash), Shellfish',
        previousSurgeries: 'Right knee arthroscopy (2021), Lumbar L4-L5 discectomy',
        contactPhone: '+1 (555) 234-8920',
      });
      setActiveTab('biodata');
    } else if (demoType === 'arthur') {
      setPatientBiodata({
        name: 'Arthur Pendelton',
        email: 'arthur.pendelton@patient-portal.org',
        password: 'PatientSecure2026!',
        age: '62',
        sex: 'Male',
        heightCm: '178',
        weightKg: '88',
        bloodGroup: 'O+',
        affectedKnee: 'Left',
        klGrade: '3',
        diagnosis: 'Moderate-to-Severe Lateral OA with Meniscal Extrusion',
        country: 'Japan',
        destinationHospital: 'University of Tokyo Hospital (Joint Replacement Division)',
        dispatchedElement: 'Personalized Custom Knee Prosthesis (Femoral Component & Tibial Baseplate)',
        allergies: 'None reported (NKDA)',
        previousSurgeries: 'Partial lateral meniscectomy (2018)',
        contactPhone: '+81 3-5550-9812',
      });
      setActiveTab('biodata');
    }
  };

  // Handle Step 2: OTP Input change and auto-advance
  const handleOtpChange = (index, value) => {
    const cleanChar = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    // Auto-advance focus to next box
    if (cleanChar && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    if (cleanChar && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        handleVerifyCode(fullCode);
      }
    }
  };

  // Handle Step 2: OTP Keydown for Backspace navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle Step 2: Paste full 6-digit code
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      if (pasteData.length === 6) {
        handleVerifyCode(pasteData);
      } else if (otpInputsRef.current[pasteData.length]) {
        otpInputsRef.current[pasteData.length]?.focus();
      }
    }
  };

  // Handle Step 2: Verification Submit
  const handleVerifyCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the medical security code.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await verify2FA(code, rememberMe);
      setSuccessMsg('Two-Step Verification successful! Access granted.');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired 6-digit verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 2: Resend Code
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setErrorMsg('');
    try {
      await resend2FA();
      setResendTimer(45);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMsg('A new 6-digit security code has been generated.');
    } catch (err) {
      setErrorMsg('Failed to resend security code.');
    }
  };

  // Autofill simulated OTP code for convenience
  const handleAutofillSimulated = () => {
    if (twoFactorState.simulatedCode) {
      const code = twoFactorState.simulatedCode;
      setOtpDigits(code.split(''));
      handleVerifyCode(code);
    }
  };

  const selectedCountryObj = COUNTRIES_CONFIG.find(c => c.name === patientBiodata.country) || COUNTRIES_CONFIG[0];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #060913 100%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top Header */}
      <header style={{
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
          }}>
            <Activity size={24} color="#0f172a" strokeWidth={2.6} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                OrthoMorph AI
              </span>
              <span className="brand-badge" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                v2.4 Pro
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Patient Biodata Intake & Cross-Border Operation Dispatch Portal
            </p>
          </div>
        </div>

        {/* MongoDB Connection Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${dbStatus?.isConnected ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
          padding: '6px 14px',
          borderRadius: '30px',
          fontSize: '0.78rem',
        }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: dbStatus?.isConnected ? '#10b981' : '#f59e0b',
            boxShadow: dbStatus?.isConnected ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: dbStatus?.isConnected ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
            {dbStatus?.isConnected ? dbStatus.mode : 'Database Offline'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {dbStatus?.dbName || 'orthomorph_db'}
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 10,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1140px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr',
          gap: '2rem',
          alignItems: 'center',
        }}>
          
          {/* Left Hero Column: Cross-border dispatch summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                <Globe size={14} />
                <span>Cross-Border Operation & Custom Element Dispatch</span>
              </div>
              <h1 style={{ fontSize: '2.3rem', lineHeight: 1.15, fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                Patient Biodata & <br />
                <span style={{
                  background: 'linear-gradient(90deg, #10b981, #00f2fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  International Operation Dispatch
                </span>
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Register your patient biodata, choose your destination operation country, and configure the specific 3D-printed surgical element to be manufactured and couriered for surgery in another country.
              </p>
            </div>

            {/* Country Operation Highlight Cards */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                  Selected Operation Destination
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>
                  {selectedCountryObj.flag} {selectedCountryObj.name}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                🏥 <strong>Hospital:</strong> {selectedCountryObj.hospital}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                🛡️ <strong>Regulatory Clearance:</strong> {selectedCountryObj.regulatory}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                ✈️ <strong>Courier Logistics:</strong> {selectedCountryObj.carrier} ({selectedCountryObj.transitTime})
              </div>
            </div>

            {/* Quick Demo Selector for Patients */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--accent-amber)' }}>
                <Sparkles size={15} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Quick Fill Sample Patient Biodata:</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDemoPatientSelect('eleanor')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🇩🇪 Eleanor Vance (Germany)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoPatientSelect('arthur')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🇯🇵 Arthur Pendelton (Japan)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Dual Portal (Patient Biodata & 2FA Gate) */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(8, 14, 26, 0.98))',
            borderRadius: '20px',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0, 242, 254, 0.2), 0 0 50px rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(24px)',
            overflow: 'hidden',
          }}>
            
            {/* STEP 2: Two-Step Verification (2FA) View */}
            {twoFactorState.isPending ? (
              <div style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)',
                    animation: 'pulse 2s infinite',
                  }}>
                    <KeyRound size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
                    Two-Step Verification (2FA)
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Enter the 6-digit Medical Security Code for{' '}
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {twoFactorState.emailMasked || 'your account'}
                    </span>
                  </p>
                </div>

                {/* Simulated Notification Push Toast */}
                {twoFactorState.simulatedCode && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Fingerprint size={18} color="#10b981" />
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'block' }}>
                          Medical Security Code Received
                        </span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '2px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                          {twoFactorState.simulatedCode}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutofillSimulated}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(16, 185, 129, 0.25)',
                        border: '1px solid #10b981',
                        borderRadius: '6px',
                        color: '#10b981',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Autofill Code
                    </button>
                  </div>
                )}

                {/* Feedback Alerts */}
                {errorMsg && (
                  <div style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#f43f5e',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1.25rem',
                  }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 6-Digit OTP Inputs */}
                <div 
                  onPaste={handleOtpPaste}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '1.5rem',
                  }}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '46px',
                        height: '54px',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#00f2fe',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: digit ? '2px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        boxShadow: digit ? '0 0 15px rgba(0, 242, 254, 0.3)' : 'none',
                        outline: 'none',
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={() => handleVerifyCode()}
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    marginBottom: '1rem',
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>{isSubmitting ? 'Verifying with MongoDB...' : 'Verify & Enter Surgical Portal'}</span>
                </button>

                {/* Resend & Back */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  <button
                    type="button"
                    onClick={cancel2FA}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Intake</span>
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={handleResend}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--accent-cyan)',
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            ) : (

              /* STEP 1: Portal Mode Selection & Form */
              <div>
                {/* Portal Mode Switcher Header */}
                <div style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.2)',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => { setPortalMode('patient'); setActiveTab('biodata'); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: portalMode === 'patient' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: portalMode === 'patient' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                        color: portalMode === 'patient' ? '#10b981' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <User size={13} />
                      <span>Patient & International Dispatch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPortalMode('doctor'); setActiveTab('doctor-demo'); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: portalMode === 'doctor' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: portalMode === 'doctor' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                        color: portalMode === 'doctor' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Stethoscope size={13} />
                      <span>Surgeon Portal</span>
                    </button>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    Step 1 of 2
                  </span>
                </div>

                {/* Sub-tabs for Patient Portal */}
                {portalMode === 'patient' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '0.75rem 1.5rem 0',
                    gap: '8px',
                  }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('biodata')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: activeTab === 'biodata' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: activeTab === 'biodata' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: activeTab === 'biodata' ? '#10b981' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <UserPlus size={14} />
                      <span>New Patient Biodata Intake</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: activeTab === 'signin' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: activeTab === 'signin' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        color: activeTab === 'signin' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <LogIn size={14} />
                      <span>Patient Sign In</span>
                    </button>
                  </div>
                )}

                {/* Sub-tabs for Doctor Portal */}
                {portalMode === 'doctor' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    padding: '0.75rem 1.5rem 0',
                    gap: '8px',
                  }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('doctor-demo')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: activeTab === 'doctor-demo' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: activeTab === 'doctor-demo' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                        color: activeTab === 'doctor-demo' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Quick Demo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: activeTab === 'signin' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: activeTab === 'signin' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                        color: activeTab === 'signin' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <LogIn size={13} />
                      <span>Doctor Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: activeTab === 'register' ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: activeTab === 'register' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                        color: activeTab === 'register' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <UserPlus size={13} />
                      <span>Register</span>
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div style={{
                    margin: '0.75rem 1.5rem 0',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#f43f5e',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* VIEW 1: Patient Biodata & International Dispatch Intake Form */}
                {portalMode === 'patient' && activeTab === 'biodata' && (
                  <form onSubmit={handlePatientIntakeSubmit} style={{ padding: '1rem 1.5rem 1.5rem', maxHeight: '480px', overflowY: 'auto' }}>
                    
                    {/* Section 1: Demographics */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        1. Patient Demographics & Contact
                      </span>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Full Patient Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Eleanor Vance"
                            value={patientBiodata.name}
                            onChange={(e) => setPatientBiodata({ ...patientBiodata, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.7rem',
                              background: 'rgba(15, 23, 42, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.8rem',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Email (Stored in MongoDB)</label>
                          <input
                            type="email"
                            required
                            placeholder="eleanor.vance@email.com"
                            value={patientBiodata.email}
                            onChange={(e) => setPatientBiodata({ ...patientBiodata, email: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.7rem',
                              background: 'rgba(15, 23, 42, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.8rem',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                      </div>

                      {/* Age, Sex, Blood Group, Height, Weight Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Age (Years)</label>
                          <input
                            type="number"
                            value={patientBiodata.age}
                            onChange={(e) => setPatientBiodata({ ...patientBiodata, age: e.target.value })}
                            style={{ width: '100%', padding: '0.45rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.78rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sex</label>
                          <select
                            value={patientBiodata.sex}
                            onChange={(e) => setPatientBiodata({ ...patientBiodata, sex: e.target.value })}
                            style={{ width: '100%', padding: '0.45rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.78rem', boxSizing: 'border-box' }}
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Blood Group</label>
                          <select
                            value={patientBiodata.bloodGroup}
                            onChange={(e) => setPatientBiodata({ ...patientBiodata, bloodGroup: e.target.value })}
                            style={{ width: '100%', padding: '0.45rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#00f2fe', fontWeight: 700, fontSize: '0.78rem', boxSizing: 'border-box' }}
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
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BMI (Auto)</label>
                          <div style={{ padding: '0.45rem', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '6px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.78rem', textAlign: 'center' }}>
                            {calculatedBMI}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Country Selection for Operation & Element Dispatch */}
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        2. Operation Country & Dispatched Surgical Element
                      </span>

                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                          Select Country for Operation (Cross-Border Dispatch)
                        </label>
                        <select
                          value={patientBiodata.country}
                          onChange={(e) => {
                            const cName = e.target.value;
                            const found = COUNTRIES_CONFIG.find(c => c.name === cName);
                            setPatientBiodata({
                              ...patientBiodata,
                              country: cName,
                              destinationHospital: found?.hospital || `${cName} Arthroplasty Center`,
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.7rem',
                            background: '#0f172a',
                            border: '1px solid rgba(0, 242, 254, 0.4)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            boxSizing: 'border-box',
                          }}
                        >
                          {COUNTRIES_CONFIG.map(c => (
                            <option key={c.code} value={c.name}>
                              {c.flag} {c.name} — {c.hospital}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                          Specific Custom Surgical Element to Send for Operation
                        </label>
                        <select
                          value={patientBiodata.dispatchedElement}
                          onChange={(e) => setPatientBiodata({ ...patientBiodata, dispatchedElement: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.7rem',
                            background: '#0f172a',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '6px',
                            color: '#10b981',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            boxSizing: 'border-box',
                          }}
                        >
                          {SURGICAL_ELEMENTS.map(elem => (
                            <option key={elem.id} value={elem.name}>
                              {elem.name} ({elem.category})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Plane size={16} />
                      <span>{isSubmitting ? 'Submitting Biodata...' : 'Proceed to Step 2 (2FA OTP Verification)'}</span>
                    </button>
                  </form>
                )}

                {/* VIEW 2: Patient / Doctor Sign In */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleSignInSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="user@medical.org"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.85rem',
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
                        padding: '0.75rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <LogIn size={16} />
                      <span>{isSubmitting ? 'Verifying...' : 'Sign In with 2FA'}</span>
                    </button>
                  </form>
                )}

                {/* VIEW 3: Doctor Quick Demo */}
                {portalMode === 'doctor' && activeTab === 'doctor-demo' && (
                  <div style={{ padding: '1rem 1.5rem 1.5rem' }}>
                    <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Select a verified physician to authenticate with 2FA:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div
                        onClick={() => handleDemoSelect('surgeon')}
                        className="demo-card-hover"
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(0, 242, 254, 0.05)',
                          border: '1px solid rgba(0, 242, 254, 0.25)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>Dr. Alistair Sterling</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Lead Orthopedic Surgeon</span>
                        </div>
                        <button type="button" className="btn-outline" style={{ padding: '3px 8px', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                          Verify 2FA →
                        </button>
                      </div>

                      <div
                        onClick={() => handleDemoSelect('radiologist')}
                        className="demo-card-hover"
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>Dr. Elena Rostova</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Chief MSK Radiologist</span>
                        </div>
                        <button type="button" className="btn-outline" style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#10b981' }}>
                          Verify 2FA →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 4: Doctor Register */}
                {portalMode === 'doctor' && activeTab === 'register' && (
                  <form onSubmit={handleDoctorRegisterSubmit} style={{ padding: '1rem 1.5rem 1.5rem' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Doctor Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Jane Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Institutional Email</label>
                      <input
                        type="email"
                        required
                        placeholder="doctor@hospital.org"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.85rem', fontWeight: 700 }}>
                      {isSubmitting ? 'Registering...' : 'Register & Proceed to 2FA'}
                    </button>
                  </form>
                )}

              </div>
            )}

            {/* Footer */}
            <div style={{
              padding: '0.65rem 1.5rem',
              background: 'rgba(0, 0, 0, 0.35)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} />
                <span>MongoDB Stored & 256-bit Encrypted</span>
              </div>
              <span>Emergency 2FA Code: 999888</span>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '0.8rem 2.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        zIndex: 10,
      }}>
        <div>OrthoMorph AI International Arthroplasty Network • ISO 13485 & CE MDR Compliant</div>
        <div>Cross-Border Custom 3D Surgical Dispatch • MongoDB Cloud Active</div>
      </footer>
    </div>
  );
}
