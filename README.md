# OrthoMorph AI — Medial Meniscus Thickness & Knee Implant Sizing Suite

[![GitHub Actions](https://img.shields.io/badge/Deploy-GitHub_Pages-blue?logo=github)](https://github.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-ODM-47A248?logo=mongodb)](https://mongodb.com/)
[![2FA](https://img.shields.io/badge/Security-2FA_OTP-10B981?logo=shield)](https://github.com/)

**OrthoMorph AI** is an end-to-end clinical AI platform designed for high-resolution 3D DICOM MRI segmentation, sub-millimeter medial meniscus morphometry, personalized total knee arthroplasty (TKA) implant sizing, patient personal biodata dossiers, and cross-border surgical element dispatch.

---

## 🌟 Key Features

1. **Mandatory 2-Step Authentication (2FA / OTP)**:
   - Physician Portal & Patient Intake Portal.
   - 6-digit OTP security challenge with auto-advancing inputs and simulated device notifications.
   - Dual-mode MongoDB persistence and browser-synced database engine for static hosting (Cloudflare Workers / GitHub Pages / Vercel).

2. **Comprehensive Patient Biodata Dossier**:
   - Demographics & Legal Identity (National Medical ID, DOB, Language).
   - Contact & Emergency Guardianship Liaison.
   - Physical Biometrics & Vital Signs (Blood Group, Height, Weight, BMI gauge, BP, SpO2).
   - Orthopedic Joint Status (Affected Knee, Kellgren-Lawrence Grade 0-4, Mechanical Alignment, ROM).
   - Medical History & Drug Allergies (Penicillin, Latex, Co-morbidities, Current Meds).
   - Live in-place editing and 1-click **Download Medical Dossier**.

3. **International Cross-Border Operation Dispatch**:
   - 11+ destination countries (Germany 🇩🇪, USA 🇺🇸, Japan 🇯🇵, UK 🇬🇧, India 🇮🇳, Switzerland 🇨🇭, UAE 🇦🇪, Singapore 🇸🇬, etc.).
   - Specific custom 3D-printed surgical element selection (Titanium PSI bone cutting jigs, personalized implants, cryopreserved allografts, XLPE inserts).
   - Live international cold-chain logistics tracking (-80°C monitored) and export customs manifest generator.

4. **Deep Learning DICOM & MONAI Segmentation**:
   - 3.0T MRI multiplanar viewer (64 slices, Sagittal/Coronal).
   - Embedded MONAI 3D Swin-UNETR multi-class tissue segmentations (Femur, Tibia, Medial/Lateral Meniscus, Cartilage).

5. **Personalized Implant Sizing & Kinematic Alignment**:
   - Biomechanical aspect ratio matching (Zimmer Biomet Persona® & Stryker Triathlon®).
   - Sub-millimeter bone resection targets & cortical bone fit calculations.

6. **Multimodal Gemini 2.5 Pro AI Operative Report**:
   - 1-click automated surgical plan generation and JSON export.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Full Stack (Client + MongoDB Server)
npm run dev

# 3. Open in Browser
http://localhost:3000/
```

---

## 📦 Deployment

### Deploy to GitHub Pages:
1. In your GitHub repository, go to **Settings ➔ Pages**.
2. Under **Build and deployment ➔ Source**, select **GitHub Actions**.
3. Push to `main` branch to trigger the automated deployment workflow.

### Deploy to Cloudflare Workers / Pages:
```bash
npm run deploy
```

---

## 🩺 Verified Demo Credentials

- **Lead Surgeon**: `alistair.sterling@stjude-ortho.org` (Password: `OrthoMorphDemo2026!`)
- **Chief Radiologist**: `elena.rostova@stjude-ortho.org` (Password: `OrthoMorphDemo2026!`)
- **Patient Candidate**: `eleanor.vance@patient-portal.org` (Password: `PatientSecure2026!`)
- **Emergency 2FA Bypass Code**: `999888`
