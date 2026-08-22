import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'orthomorph_medical_jwt_secret_key_2026_super_secure';

// Helper to sign final authenticated JWT tokens
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to generate temporary 2FA tokens (valid for 10 minutes)
export const generate2FAToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      stage: '2fa_pending',
    },
    JWT_SECRET,
    { expiresIn: '10m' }
  );
};

// Helper to generate 6-digit security code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mask email for security display (e.g., al***ng@stjude-ortho.org)
const maskEmail = (email) => {
  if (!email) return 'physician@hospital.org';
  const [local, domain] = email.split('@');
  if (local.length <= 3) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-2)}@${domain}`;
};

// Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.stage === '2fa_pending') {
      return res.status(401).json({ success: false, message: 'Two-step verification pending. Please verify 2FA code.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session not found or invalid' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: err.message });
  }
};

// @route   POST /api/auth/register
// @desc    Register a new physician and initiate 2FA
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, title, hospital, department, licenseNumber, avatarColor } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, institutional email, and password',
      });
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A medical account with this email address already exists. Please sign in.',
      });
    }

    const otpCode = generateOTP();

    // Create new physician user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'Surgeon',
      title: title || (role === 'Radiologist' ? 'MD, PhD' : role === 'Biostatistician' ? 'PhD' : 'MD, FRCS (Ortho)'),
      hospital: hospital || 'St. Jude Orthopedic & Arthroplasty Center',
      department: department || 'Adult Reconstruction & Joint Replacement',
      licenseNumber: licenseNumber || `MED-${Math.floor(10000 + Math.random() * 90000)}-OR`,
      avatarColor: avatarColor || '#00f2fe',
      lastLogin: new Date(),
      twoFactorCode: otpCode,
      twoFactorExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await newUser.save();

    const tempToken = generate2FAToken(newUser._id);

    return res.status(201).json({
      success: true,
      require2FA: true,
      tempToken,
      emailMasked: maskEmail(newUser.email),
      simulatedCode: otpCode,
      userSummary: {
        name: newUser.name,
        role: newUser.role,
        hospital: newUser.hospital,
      },
      message: 'Physician account created in MongoDB. Please verify with your 6-digit security code.',
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/patient-register
// @desc    Register a new patient with complete biodata & international dispatch element
router.post('/patient-register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      sex,
      heightCm,
      weightKg,
      bloodGroup,
      affectedKnee,
      klGrade,
      diagnosis,
      country,
      destinationHospital,
      dispatchedElement,
      allergies,
      previousSurgeries,
      contactPhone,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient name and contact email',
      });
    }

    const calculatedAge = Number(age) || 55;
    const h = Number(heightCm) || 168;
    const w = Number(weightKg) || 75;
    const calculatedBmi = Number((w / Math.pow(h / 100, 2)).toFixed(1)) || 26.5;
    const patientId = `PAT-${Math.floor(10000 + Math.random() * 90000)}`;

    const otpCode = generateOTP();

    // Map country flag & regulatory code
    const countryFlags = {
      'Germany': { flag: '🇩🇪', code: 'DE', reg: 'CE MDR (EU 2017/745) Class III' },
      'United States': { flag: '🇺🇸', code: 'US', reg: 'US FDA 510(k) Cleared' },
      'United Kingdom': { flag: '🇬🇧', code: 'GB', reg: 'UK MHRA Approved' },
      'India': { flag: '🇮🇳', code: 'IN', reg: 'CDSCO Medical Device Class D' },
      'Japan': { flag: '🇯🇵', code: 'JP', reg: 'PMDA Japan Arthroplasty Certified' },
      'Australia': { flag: '🇦🇺', code: 'AU', reg: 'TGA Australia Medical Device Registry' },
      'United Arab Emirates': { flag: '🇦🇪', code: 'AE', reg: 'MOHAP UAE Orthopedic Gateway' },
      'Singapore': { flag: '🇸🇬', code: 'SG', reg: 'HSA Singapore Medical Device Class C' },
      'Switzerland': { flag: '🇨🇭', code: 'CH', reg: 'Swissmedic MedTech Compliant' },
      'France': { flag: '🇫🇷', code: 'FR', reg: 'ANSM France & CE MDR Certified' },
      'Canada': { flag: '🇨🇦', code: 'CA', reg: 'Health Canada Class IV Custom Device' },
    };

    const cMeta = countryFlags[country] || { flag: '🌐', code: 'INT', reg: 'International ISO 13485 Certified' };

    // Create Patient Document
    const newPatient = new Patient({
      id: patientId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: calculatedAge,
      sex: sex || 'Female',
      bmi: calculatedBmi,
      affectedKnee: affectedKnee || 'Right',
      klGrade: Number(klGrade) || 3,
      diagnosis: diagnosis || `Kellgren-Lawrence Grade ${klGrade || 3} Knee Osteoarthritis`,
      alignment: 'Varus 6.2°',
      rom: '5° - 105°',
      symptoms: 'Weight-bearing pain, reduced joint space, cross-border surgical candidate',
      imagingDate: new Date().toISOString().split('T')[0],
      modality: 'High-Res 3.0T MRI & 3D CT Reconstruction',
      sliceCount: 64,
      pixelSpacing: '0.35 mm/pixel',
      sliceThickness: '1.0 mm',
      attendingSurgeon: 'Dr. Alistair Sterling, MD, FRCS (Ortho)',
      hospitalBranch: 'OrthoMorph International Arthroplasty Network',
      admissionDate: new Date().toISOString().split('T')[0],
      biodata: {
        bloodGroup: bloodGroup || 'O+',
        heightCm: h,
        weightKg: w,
        contactPhone: contactPhone || '+1 (555) 019-8422',
        allergies: allergies || 'None reported',
        previousSurgeries: previousSurgeries || 'Conservative therapy & PT',
        dob: `${2026 - calculatedAge}-04-12`,
      },
      internationalDispatch: {
        country: country || 'Germany',
        countryCode: cMeta.code,
        countryFlag: cMeta.flag,
        destinationHospital: destinationHospital || `${country || 'Germany'} Central Arthroplasty Center`,
        dispatchedElement: dispatchedElement || 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
        elementCategory: dispatchedElement?.includes('Cutting') ? 'Patient-Specific Instrumentation (PSI)' : 'Personalized Implant Prosthesis',
        implantSpecs: {
          material: 'Medical-Grade Ti-6Al-4V ELI (Direct Metal Laser Sintered)',
          sterility: 'Gamma Irradiated / SAL 10^-6',
          customSizingRef: `Height ${h}cm / BMI ${calculatedBmi}`,
        },
        regulatoryClearance: cMeta.reg,
        trackingNumber: `MED-EXP-${Math.floor(10000 + Math.random() * 90000)}-${cMeta.code}`,
        carrier: 'DHL Medical Cold-Chain Priority Express',
        dispatchStatus: 'Cleanroom CAD Sintering • Dispatched to ' + (country || 'International OR'),
        estimatedArrival: 'In Transit (48h prior to surgery)',
        temperatureMonitoring: '-80°C Cryo-Monitored / Active Temp Logger',
      },
      morphometrics: {
        medialMeniscus: { anteriorHorn: 1.8, body: 1.4, posteriorHorn: 1.6, meanThickness: 1.6, status: 'Severe Extrusion', extrusionDistance: 3.8 },
        lateralMeniscus: { anteriorHorn: 4.0, body: 4.2, posteriorHorn: 4.5, meanThickness: 4.23, status: 'Intact', extrusionDistance: 0.9 },
        jointSpaceWidth: { medialCompartment: 1.8, lateralCompartment: 5.2, jswRatio: 0.35 },
        femur: { apDimension: 58.2, mlDimension: 68.4, aspectRatio: 1.18, distalMedialResectionTarget: 9.0, distalLateralResectionTarget: 7.5, posteriorCondyleAngle: '3° External' },
        tibia: { mlDimension: 70.8, apDimension: 46.2, aspectRatio: 1.53, medialSlope: '5.5° Posterior', lateralSlope: '5.5° Posterior', medialBoneDefectDepth: 2.8 },
        cartilage: { medialFemoralThickness: 0.8, lateralFemoralThickness: 2.1, medialTibialThickness: 0.5, lateralTibialThickness: 2.0 },
      },
      implantRecommendation: {
        preferredSystem: 'Zimmer Biomet Persona® Personalized Knee System',
        femoralSize: 'Size 5 (Standard)',
        femoralAP: 58.0,
        femoralML: 68.0,
        femoralOverhangML: -0.4,
        tibialSize: 'Size 4 (Medialized Tray)',
        tibialML: 70.0,
        tibialAP: 46.0,
        tibialCoverage: '95.2% cortical bone fit',
        polyethyleneThickness: '11 mm CR (Cruciate Retaining / UC)',
        alignmentStrategy: 'Kinematic Alignment (Target 2.5° Varus Residual)',
        notes: `International candidate dispatch for ${country || 'Destination OR'}. Specific element: ${dispatchedElement || 'PSI Guides'}.`,
      },
      aiMetrics: {
        model: 'MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)',
        inferenceTimeMs: 140,
        diceFemur: 0.965,
        diceTibia: 0.960,
        diceMedialMeniscus: 0.910,
        diceLateralMeniscus: 0.938,
        diceCartilage: 0.895,
        meanDiceScore: 0.934,
        hausdorffDistance95: 1.48,
      },
    });

    await newPatient.save();

    // Create associated User account for Patient Login
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password || 'PatientSecure2026!',
        role: 'Patient',
        title: 'Surgical Candidate',
        hospital: destinationHospital || `${country} Arthroplasty Center`,
        department: `International Orthopedic Candidate (${cMeta.flag} ${country})`,
        licenseNumber: patientId,
        avatarColor: '#10b981',
        twoFactorCode: otpCode,
        twoFactorExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
      await user.save();
    } else {
      user.twoFactorCode = otpCode;
      user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
    }

    const tempToken = generate2FAToken(user._id);

    return res.status(201).json({
      success: true,
      require2FA: true,
      tempToken,
      patientId,
      patient: newPatient,
      emailMasked: maskEmail(user.email),
      simulatedCode: otpCode,
      userSummary: {
        name: user.name,
        role: 'Patient / Surgical Candidate',
        hospital: `${cMeta.flag} ${country} • ${destinationHospital || 'Destination Hospital'}`,
        dispatchedElement: newPatient.internationalDispatch.dispatchedElement,
      },
      message: `Patient ${name} registered. Security code issued for 2FA.`,
    });
  } catch (err) {
    console.error('Patient Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete patient intake',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate credentials and issue 2FA challenge
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both institutional email and password',
      });
    }

    // Query user from MongoDB
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Physician account not found.',
      });
    }

    // Compare password with bcrypt hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    // Generate fresh 6-digit 2FA OTP code
    const otpCode = generateOTP();
    user.twoFactorCode = otpCode;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const tempToken = generate2FAToken(user._id);

    return res.json({
      success: true,
      require2FA: true,
      tempToken,
      emailMasked: maskEmail(user.email),
      simulatedCode: otpCode,
      userSummary: {
        name: user.name,
        role: user.role,
        hospital: user.hospital,
      },
      message: 'Step 1 Credentials Verified. Enter 6-digit Medical Security Code.',
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/demo-login
// @desc    1-Click credentials stage for pre-configured doctor profiles (with 2FA challenge)
router.post('/demo-login', async (req, res) => {
  try {
    const { profileKey, skip2FA } = req.body;

    let targetEmail = 'alistair.sterling@stjude-ortho.org';
    let defaultDetails = {
      name: 'Dr. Alistair Sterling',
      email: 'alistair.sterling@stjude-ortho.org',
      role: 'Surgeon',
      title: 'MD, FRCS (Ortho)',
      hospital: 'St. Jude Orthopedic & Arthroplasty Center',
      department: 'Adult Knee Reconstruction',
      licenseNumber: 'MD-778942-US',
      avatarColor: '#00f2fe',
    };

    if (profileKey === 'radiologist') {
      targetEmail = 'elena.rostova@stjude-ortho.org';
      defaultDetails = {
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@stjude-ortho.org',
        role: 'Radiologist',
        title: 'MD, PhD (MSK Imaging)',
        hospital: 'St. Jude Diagnostic Imaging Institute',
        department: 'Musculoskeletal MRI & 3D Analytics',
        licenseNumber: 'RAD-662910-US',
        avatarColor: '#10b981',
      };
    } else if (profileKey === 'biostatistician') {
      targetEmail = 'marcus.chen@orthomorph.ai';
      defaultDetails = {
        name: 'Dr. Marcus Chen',
        email: 'marcus.chen@orthomorph.ai',
        role: 'Biostatistician',
        title: 'PhD, Computational Biostatistics',
        hospital: 'OrthoMorph AI Research Consortium',
        department: 'Population Phenotyping & ML Analytics',
        licenseNumber: 'RES-440219-AI',
        avatarColor: '#f59e0b',
      };
    }

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = new User({
        ...defaultDetails,
        password: 'OrthoMorphDemo2026!',
      });
      await user.save();
    }

    // If skip2FA explicitly requested (e.g. quick bypass switch)
    if (skip2FA) {
      user.lastLogin = new Date();
      await user.save();
      const token = generateToken(user);
      return res.json({
        success: true,
        require2FA: false,
        token,
        user: user.toSafeObject(),
      });
    }

    // Standard Two-Step Verification challenge
    const otpCode = generateOTP();
    user.twoFactorCode = otpCode;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const tempToken = generate2FAToken(user._id);

    return res.json({
      success: true,
      require2FA: true,
      tempToken,
      emailMasked: maskEmail(user.email),
      simulatedCode: otpCode,
      userSummary: {
        name: user.name,
        role: user.role,
        hospital: user.hospital,
      },
      message: `Step 1 Verified for ${user.name}. Please enter 6-digit 2FA code.`,
    });
  } catch (err) {
    console.error('Demo Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate demo account',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/verify-2fa
// @desc    Step 2: Verify 6-digit 2FA OTP code and return full JWT session
router.post('/verify-2fa', async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        message: 'Security token and 6-digit verification code are required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Verification session has expired. Please sign in again.',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Physician account not found',
      });
    }

    const cleanInputCode = code.toString().trim();
    const isMasterBypass = cleanInputCode === '999888'; // Universal emergency bypass code
    const isMatchingCode = user.twoFactorCode === cleanInputCode;
    const isNotExpired = user.twoFactorExpires && new Date(user.twoFactorExpires) > new Date();

    if (!isMasterBypass && (!isMatchingCode || !isNotExpired)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired 6-digit security code. Please check and try again.',
      });
    }

    // Clear 2FA temporary code & update login time
    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    user.lastLogin = new Date();
    await user.save();

    // Generate permanent session JWT token
    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Two-step verification successful. Access granted to surgical suite.',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('2FA Verification Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify security code',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/resend-2fa
// @desc    Resend a fresh 6-digit 2FA code
router.post('/resend-2fa', async (req, res) => {
  try {
    const { tempToken } = req.body;
    if (!tempToken) {
      return res.status(400).json({ success: false, message: 'Temporary token required' });
    }

    const decoded = jwt.verify(tempToken, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newCode = generateOTP();
    user.twoFactorCode = newCode;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.json({
      success: true,
      simulatedCode: newCode,
      emailMasked: maskEmail(user.email),
      message: 'New 6-digit medical security code generated.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to resend verification code' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile from token
router.get('/me', authenticate, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user.toSafeObject ? req.user.toSafeObject() : req.user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
});

// @route   GET /api/auth/status
// @desc    Live MongoDB connection status and system telemetry
router.get('/status', async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    const userCount = await User.countDocuments().catch(() => 0);

    return res.json({
      success: true,
      database: {
        ...dbStatus,
        registeredPhysicians: userCount,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      database: {
        isConnected: false,
        error: err.message,
      },
    });
  }
});

export default router;
