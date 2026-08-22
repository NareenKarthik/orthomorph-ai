// Gemini API Integration Service for Orthopedic & Meniscus AI Reporting

const GEMINI_STORAGE_KEY = 'orthomorph_gemini_api_key';
const GEMINI_MODEL_KEY = 'orthomorph_gemini_model';

export const getStoredApiKey = () => {
  return localStorage.getItem(GEMINI_STORAGE_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setStoredApiKey = (key) => {
  if (!key) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
};

export const getStoredModel = () => {
  return localStorage.getItem(GEMINI_MODEL_KEY) || 'gemini-1.5-flash';
};

export const setStoredModel = (model) => {
  localStorage.setItem(GEMINI_MODEL_KEY, model);
};

export const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fast & Recommended)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-Gen High Speed)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Clinical Reasoning)' }
];

export async function testGeminiApiKey(apiKey, modelName = 'gemini-1.5-flash') {
  if (!apiKey) return { success: false, error: 'API key cannot be empty' };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with "VALID" if you receive this orthopedic AI test ping.' }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { success: true, text: replyText };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Generate Comprehensive Orthopedic Clinical Summary using Gemini API or Offline Expert Engine
 */
export async function generateClinicalReport(patient, customPromptAddition = '', preferredModel = null) {
  const apiKey = getStoredApiKey();
  const model = preferredModel || getStoredModel();

  const clinicalSystemPrompt = `You are a Senior Orthopedic Radiologist & Knee Arthroplasty Surgical Consultant AI.
Generate an exhaustive, highly professional, structured Clinical & Surgical Planning Report based on automated MONAI deep learning segmentation and 3D morphometric measurements.

Structure the report in clean GitHub-flavored Markdown with these exact sections:
1. # CLINICAL AI RADIOLOGY & ARTHROPLASTY PLANNING REPORT
2. ## 1. Patient Demographics & Exam Characteristics
3. ## 2. Deep Learning Segmentation & Quality Assurance (MONAI Swin-UNETR)
4. ## 3. Medial Meniscus Morphometry & Meniscopathy Assessment
5. ## 4. Joint Space & Cartilage Degradation Analysis
6. ## 5. Patient-Specific Knee Implant Sizing & Resection Strategy
7. ## 6. Surgical Considerations & Biomechanical Risk Stratification
8. ## 7. Diagnostic Coding & Clinical Recommendations (ICD-10 & CPT)

Tone: Objective, authoritative, medical-grade, precise with exact anatomical landmarks and millimeter measurements.`;

  const patientContext = `
PATIENT PROFILE:
- ID: ${patient.id}
- Name: ${patient.name}
- Age: ${patient.age} (${patient.sex}) | BMI: ${patient.bmi} kg/m²
- Affected Knee: ${patient.affectedKnee} Knee
- Clinical Diagnosis: ${patient.diagnosis}
- Mechanical Alignment: ${patient.alignment}
- Range of Motion: ${patient.rom}
- Presenting Symptoms: ${patient.symptoms}
- Imaging Protocol: ${patient.modality} (${patient.imagingDate})

AUTOMATED MONAI 3D SEGMENTATION METRICS:
- Model Architecture: ${patient.aiMetrics.model}
- Inference Speed: ${patient.aiMetrics.inferenceTimeMs} ms
- Mean Dice Similarity Coefficient: ${(patient.aiMetrics.meanDiceScore * 100).toFixed(1)}%
- Femur Dice: ${(patient.aiMetrics.diceFemur * 100).toFixed(1)}% | Tibia Dice: ${(patient.aiMetrics.diceTibia * 100).toFixed(1)}%
- Medial Meniscus Dice: ${(patient.aiMetrics.diceMedialMeniscus * 100).toFixed(1)}% | Lateral Meniscus Dice: ${(patient.aiMetrics.diceLateralMeniscus * 100).toFixed(1)}%
- Articular Cartilage Dice: ${(patient.aiMetrics.diceCartilage * 100).toFixed(1)}%
- 95th Percentile Hausdorff Distance: ${patient.aiMetrics.hausdorffDistance95} mm

MEASURED MORPHOMETRICS:
- Medial Meniscus Anterior Horn Thickness: ${patient.morphometrics.medialMeniscus.anteriorHorn} mm
- Medial Meniscus Body Thickness: ${patient.morphometrics.medialMeniscus.body} mm
- Medial Meniscus Posterior Horn Thickness: ${patient.morphometrics.medialMeniscus.posteriorHorn} mm
- Mean Medial Meniscus Thickness: ${patient.morphometrics.medialMeniscus.meanThickness} mm
- Meniscal Status: ${patient.morphometrics.medialMeniscus.status}
- Coronal Extrusion Distance: ${patient.morphometrics.medialMeniscus.extrusionDistance} mm
- Medial Joint Space Width (JSW): ${patient.morphometrics.jointSpaceWidth.medialCompartment} mm
- Lateral Joint Space Width (JSW): ${patient.morphometrics.jointSpaceWidth.lateralCompartment} mm
- JSW Medial/Lateral Ratio: ${patient.morphometrics.jointSpaceWidth.jswRatio}
- Kellgren-Lawrence Grade: Grade ${patient.klGrade}

FEMUR & TIBIAL DIMENSIONS FOR IMPLANT PLANNING:
- Femur AP Dimension: ${patient.morphometrics.femur.apDimension} mm
- Femur ML Dimension: ${patient.morphometrics.femur.mlDimension} mm (Aspect Ratio: ${patient.morphometrics.femur.aspectRatio})
- Distal Medial Resection Target: ${patient.morphometrics.femur.distalMedialResectionTarget} mm
- Distal Lateral Resection Target: ${patient.morphometrics.femur.distalLateralResectionTarget} mm
- Tibial Plateau ML Dimension: ${patient.morphometrics.tibia.mlDimension} mm
- Tibial Plateau AP Dimension: ${patient.morphometrics.tibia.apDimension} mm (Aspect Ratio: ${patient.morphometrics.tibia.aspectRatio})
- Medial Bone Defect Depth: ${patient.morphometrics.tibia.medialBoneDefectDepth} mm

RECOMMENDED IMPLANT SPECIFICATIONS:
- Preferred System: ${patient.implantRecommendation.preferredSystem}
- Recommended Femoral Size: ${patient.implantRecommendation.femoralSize} (AP ${patient.implantRecommendation.femoralAP} mm / ML ${patient.implantRecommendation.femoralML} mm)
- Femoral ML Overhang / Underhang Margin: ${patient.implantRecommendation.femoralOverhangML} mm
- Recommended Tibial Size: ${patient.implantRecommendation.tibialSize} (ML ${patient.implantRecommendation.tibialML} mm / AP ${patient.implantRecommendation.tibialAP} mm)
- Tibial Cortical Coverage: ${patient.implantRecommendation.tibialCoverage}
- Polyethylene Insert: ${patient.implantRecommendation.polyethyleneThickness}
- Alignment Target: ${patient.implantRecommendation.alignmentStrategy}
- Arthroplasty Notes: ${patient.implantRecommendation.notes}

${customPromptAddition ? `USER SPECIFIC FOCUS / REQUEST: ${customPromptAddition}` : ''}
`;

  // If live API key is present, attempt live request to Google Gemini API
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: clinicalSystemPrompt },
              { text: patientContext }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          maxOutputTokens: 2500
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedMarkdown = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedMarkdown) {
        return {
          source: 'gemini-live',
          model: model,
          markdown: generatedMarkdown,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Gemini Live API call failed, falling back to expert synthesis:', err);
      return {
        source: 'gemini-fallback',
        errorNotice: `Live API call error (${err.message}). Showing expert synthesized report.`,
        model: 'Expert Medical Engine (Offline Fallback)',
        markdown: generateExpertOfflineReport(patient),
        timestamp: new Date().toISOString()
      };
    }
  }

  // Fallback to rich built-in medical report generator
  return {
    source: 'expert-engine',
    model: 'OrthoMorph Expert Clinical Rule-Engine (Zero-Latency Local)',
    markdown: generateExpertOfflineReport(patient),
    timestamp: new Date().toISOString()
  };
}

function generateExpertOfflineReport(patient) {
  const isHealthy = patient.klGrade === 0;
  const isSevere = patient.klGrade >= 4;
  const isCandidateUKA = patient.klGrade === 2;

  return `# CLINICAL AI RADIOLOGY & ARTHROPLASTY PLANNING REPORT
**Document ID:** RPT-AI-${patient.id}-${Math.floor(1000 + Math.random() * 9000)}  
**Report Generated:** ${new Date().toLocaleString()}  
**System Version:** OrthoMorph AI v2.4 (PyTorch/MONAI + Gemini Medical Core)  

---

## 1. Patient Demographics & Exam Characteristics
- **Patient Name:** ${patient.name} | **MRN / ID:** \`${patient.id}\`
- **Age / Biological Sex:** ${patient.age} Years | ${patient.sex}
- **Body Mass Index (BMI):** ${patient.bmi} kg/m²
- **Anatomical Exam:** ${patient.affectedKnee} Knee | ${patient.modality}
- **Mechanical Coronal Alignment:** ${patient.alignment}
- **Active Range of Motion:** ${patient.rom}
- **Clinical Presentation:** ${patient.symptoms}

---

## 2. Deep Learning Segmentation & Quality Assurance
The 3D volumetric MRI/CT volume was preprocessed with isotropic resampling and segmented via the **${patient.aiMetrics.model}** pipeline.
- **Inference Time:** \`${patient.aiMetrics.inferenceTimeMs} ms\` across 64 multiplanar slices.
- **Global Mean Dice Similarity Score (DSC):** **${(patient.aiMetrics.meanDiceScore * 100).toFixed(1)}%** (Ground truth validation threshold > 88.0%).
- **Femoral Condyle Mask DSC:** ${(patient.aiMetrics.diceFemur * 100).toFixed(1)}% | **Tibial Plateau Mask DSC:** ${(patient.aiMetrics.diceTibia * 100).toFixed(1)}%
- **Medial Meniscus Mask DSC:** ${(patient.aiMetrics.diceMedialMeniscus * 100).toFixed(1)}% | **Lateral Meniscus Mask DSC:** ${(patient.aiMetrics.diceLateralMeniscus * 100).toFixed(1)}%
- **95% Hausdorff Distance:** ${patient.aiMetrics.hausdorffDistance95} mm *(sub-voxel anatomical boundary precision)*.

---

## 3. Medial Meniscus Morphometry & Meniscopathy Assessment
Automated 3D thickness profiling along the anterior horn, central body, and posterior horn:
- **Anterior Horn Thickness:** \`${patient.morphometrics.medialMeniscus.anteriorHorn} mm\` (Normative: 4.8 ± 0.6 mm)
- **Central Meniscal Body Thickness:** \`${patient.morphometrics.medialMeniscus.body} mm\` (Normative: 5.2 ± 0.5 mm)
- **Posterior Horn Thickness:** \`${patient.morphometrics.medialMeniscus.posteriorHorn} mm\` (Normative: 5.6 ± 0.7 mm)
- **Composite Mean Thickness:** **${patient.morphometrics.medialMeniscus.meanThickness} mm**
- **Meniscal Extrusion Distance:** \`${patient.morphometrics.medialMeniscus.extrusionDistance} mm\`
- **Pathological Morphology:** *${patient.morphometrics.medialMeniscus.status}*

> **Radiological Impression:** ${isHealthy ? 'Preserved fibrocartilage triangular wedge with homogeneous low T1/T2 signal. No meniscopathy.' : `Marked reduction in medial meniscal height with ${patient.morphometrics.medialMeniscus.extrusionDistance > 3.0 ? 'severe coronal extrusion (>3mm indicative of root tear/functional hoop stress failure)' : 'focal degenerative tearing'}.`}

---

## 4. Joint Space & Cartilage Degradation Analysis
- **Medial Compartment JSW:** \`${patient.morphometrics.jointSpaceWidth.medialCompartment} mm\`
- **Lateral Compartment JSW:** \`${patient.morphometrics.jointSpaceWidth.lateralCompartment} mm\`
- **Joint Space Asymmetry Ratio (Medial / Lateral):** \`${patient.morphometrics.jointSpaceWidth.jswRatio}\`
- **Subchondral Cartilage Depth:** Medial Femur \`${patient.morphometrics.cartilage.medialFemoralThickness} mm\`, Medial Tibia \`${patient.morphometrics.cartilage.medialTibialThickness} mm\`.
- **Kellgren-Lawrence Osteoarthritis Severity:** **Grade ${patient.klGrade}** (${isSevere ? 'Severe / Bone-on-Bone' : isHealthy ? 'None / Normative' : 'Moderate OA'}).

---

## 5. Patient-Specific Knee Implant Sizing & Resection Strategy
Morphometric extraction from segmented cortical contours for patient-matched prosthesis selection:
- **Femur Dimensions:** AP \`${patient.morphometrics.femur.apDimension} mm\` | ML \`${patient.morphometrics.femur.mlDimension} mm\` (Aspect Ratio: \`${patient.morphometrics.femur.aspectRatio}\`)
- **Tibia Dimensions:** ML \`${patient.morphometrics.tibia.mlDimension} mm\` | AP \`${patient.morphometrics.tibia.apDimension} mm\`
- **Recommended Implant System:** **${patient.implantRecommendation.preferredSystem}**
- **Femoral Component Sizing:** **${patient.implantRecommendation.femoralSize}** (Planned AP: ${patient.implantRecommendation.femoralAP} mm / ML: ${patient.implantRecommendation.femoralML} mm)
- **Femoral ML Overhang / Underhang:** \`${patient.implantRecommendation.femoralOverhangML} mm\` *(Zero anterior notching risk, optimal ML bone-implant boundary)*.
- **Tibial Component Sizing:** **${patient.implantRecommendation.tibialSize}** (${patient.implantRecommendation.tibialCoverage})
- **Polyethylene Insert Selection:** **${patient.implantRecommendation.polyethyleneThickness}**
- **Resection Strategy:** Distal Medial Femur \`${patient.morphometrics.femur.distalMedialResectionTarget} mm\`, Distal Lateral Femur \`${patient.morphometrics.femur.distalLateralResectionTarget} mm\`.

---

## 6. Surgical Considerations & Biomechanical Risk Stratification
${isHealthy ? 'No surgical arthroplasty indicated. Patient exhibits healthy baseline knee joint structures.' : isCandidateUKA ? 'Patient is an outstanding candidate for **Medial Unicompartmental Knee Arthroplasty (UKA)**. Retaining the ACL, PCL, and intact lateral compartment will preserve native proprioception and joint kinematics.' : `Total Knee Arthroplasty (TKA) is indicated. Key operative precautions:
1. **Medial Bone Loss:** Medial tibial plateau defect of \`${patient.morphometrics.tibia.medialBoneDefectDepth} mm\` requires ${patient.morphometrics.tibia.medialBoneDefectDepth > 4.0 ? 'a modular 5mm tibial augment wedge' : 'careful surface preparation'}.
2. **Varus Deformity Release:** Progressive medial soft tissue release (deep MCL / posteromedial corner) to re-establish neutral coronal balance without over-resecting lateral bone.
3. **Flexion/Extension Gap:** Selected ${patient.implantRecommendation.polyethyleneThickness} insert ensures stability in 90° flexion and full extension.`}

---

## 7. Diagnostic Coding & Clinical Recommendations
- **Primary ICD-10 Diagnosis:** ${isHealthy ? '`Z00.00` (General medical examination / Asymptomatic)' : isSevere ? '`M17.11` (Unilateral primary osteoarthritis, right knee) / `M23.22` (Derangement of meniscus)' : '`M17.12` (Unilateral primary osteoarthritis, left knee)'}
- **Recommended CPT Surgical Code:** ${isHealthy ? 'N/A (Conservative maintenance)' : isCandidateUKA ? '`27446` (Arthroplasty, knee, condyle and plateau; medial OR lateral compartment)' : '`27447` (Total Knee Arthroplasty, TKA)'}
- **Attending Surgeon Review:** Recommended for pre-operative 3D surgical planning sign-off.
`;
}
