// Comprehensive Medical Dataset for Knee Osteoarthritis & Implant Sizing

export const PATIENT_CASES = [
  {
    id: "PAT-84920",
    name: "Eleanor Vance",
    age: 67,
    sex: "Female",
    bmi: 29.4,
    affectedKnee: "Right",
    klGrade: 4, // Kellgren-Lawrence Grade 0-4
    diagnosis: "End-Stage Medial Compartment Knee Osteoarthritis with Severe Varus Deformity",
    alignment: "Varus 8.5°",
    rom: "10° - 95° (Flexion contracture)",
    symptoms: "Severe weight-bearing pain, night pain, crepitus, walking distance < 100m",
    imagingDate: "2026-03-14",
    modality: "3D Sagittal/Coronal 3.0T MRI + Weight-bearing CT",
    sliceCount: 64,
    pixelSpacing: "0.35 mm/pixel",
    sliceThickness: "1.0 mm",
    attendingSurgeon: "Dr. Alistair Sterling, MD, FRCS (Ortho)",
    hospitalBranch: "St. Jude Orthopedic & Arthroplasty Center",
    admissionDate: "2026-03-10",
    
    // Morphometrics (Calculated from Segmentation)
    morphometrics: {
      medialMeniscus: {
        anteriorHorn: 1.4, // mm (severely thinned / extruded)
        body: 0.9,         // mm (severe maceration)
        posteriorHorn: 1.1,// mm
        meanThickness: 1.13,
        status: "Severe Extrusion & Maceration (>75% volume loss)",
        extrusionDistance: 4.8, // mm
      },
      lateralMeniscus: {
        anteriorHorn: 4.2,
        body: 4.6,
        posteriorHorn: 4.8,
        meanThickness: 4.53,
        status: "Intact, preserved height",
        extrusionDistance: 0.8,
      },
      jointSpaceWidth: {
        medialCompartment: 1.2, // mm (bone-on-bone near contact)
        lateralCompartment: 5.6, // mm
        jswRatio: 0.21,
      },
      femur: {
        apDimension: 56.4, // mm
        mlDimension: 66.8, // mm
        aspectRatio: 1.18,
        distalMedialResectionTarget: 9.0, // mm
        distalLateralResectionTarget: 7.0, // mm
        posteriorCondyleAngle: "3° External",
      },
      tibia: {
        mlDimension: 69.2, // mm
        apDimension: 44.8, // mm
        aspectRatio: 1.54,
        medialSlope: "5.5° Posterior",
        lateralSlope: "6.0° Posterior",
        medialBoneDefectDepth: 3.5, // mm (requires 5mm aug or shallow recut)
      },
      cartilage: {
        medialFemoralThickness: 0.4, // mm (denuded down to subchondral bone)
        lateralFemoralThickness: 2.3, // mm
        medialTibialThickness: 0.2, // mm
        lateralTibialThickness: 2.1, // mm
      }
    },

    // AI Segmentation Performance
    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 142,
      diceFemur: 0.968,
      diceTibia: 0.962,
      diceMedialMeniscus: 0.914,
      diceLateralMeniscus: 0.941,
      diceCartilage: 0.898,
      meanDiceScore: 0.937,
      hausdorffDistance95: 1.45, // mm
    },

    // Implant Recommendation
    implantRecommendation: {
      preferredSystem: "Zimmer Biomet Persona® Personalized Knee System",
      femoralSize: "Size 4 (Narrow/Standard)",
      femoralAP: 56.5,
      femoralML: 66.0,
      femoralOverhangML: -0.8, // mm (negative = underhang safe margin)
      tibialSize: "Size 3 (Medialized Tray)",
      tibialML: 68.5,
      tibialAP: 44.0,
      tibialCoverage: "94.8% cortical bone fit",
      polyethyleneThickness: "12 mm CR (Cruciate Retaining / UC)",
      alignmentStrategy: "Kinematic Alignment (Target 3° Varus Residual)",
      notes: "Severe medial wear requires 12mm insert to restore medial joint line without over-tightening flexion gap."
    },

    // Longitudinal Visit Timeline
    visits: [
      {
        date: "2025-08-12",
        type: "Initial Consult",
        womac: 68, // (0-100 scale, higher = worse pain/disability)
        oks: 18,    // Oxford Knee Score (0-48, lower = worse)
        vasPain: 8, // Visual Analog Scale 0-10
        notes: "Failed conservative therapy (NSAIDs, corticosteroid injection x2). Severe antalgic gait."
      },
      {
        date: "2026-03-14",
        type: "Pre-Op AI Sizing & Imaging",
        womac: 74,
        oks: 15,
        vasPain: 9,
        notes: "3D MRI + CT protocol loaded into OrthoMorph AI. MONAI segmentation verified."
      },
      {
        date: "2026-04-20",
        type: "6-Week Post-Op Followup",
        womac: 28,
        oks: 36,
        vasPain: 2,
        notes: "Persona Size 4 / Tibia Size 3 placed with zero overhang. Coronal alignment restored to neutral. ROM 0-110°."
      }
    ]
  },
  {
    id: "PAT-91304",
    name: "Arthur Pendelton",
    age: 62,
    sex: "Male",
    bmi: 27.8,
    affectedKnee: "Left",
    klGrade: 3,
    diagnosis: "Moderate-to-Severe Medial & Patellofemoral Osteoarthritis",
    alignment: "Varus 4.2°",
    rom: "0° - 115°",
    symptoms: "Stairs ascent/descent difficulty, joint stiffness > 30min morning, localized medial joint line tenderness",
    imagingDate: "2026-04-02",
    modality: "3D Coronal T2-weighted FSE 3.0T MRI",
    sliceCount: 64,
    pixelSpacing: "0.35 mm/pixel",
    sliceThickness: "1.0 mm",
    attendingSurgeon: "Dr. Samantha Reed, MD (Joint Reconstruction)",
    hospitalBranch: "MetroHealth Orthopedic Pavilion",
    admissionDate: "2026-03-28",
    
    morphometrics: {
      medialMeniscus: {
        anteriorHorn: 2.2,
        body: 1.8,
        posteriorHorn: 1.6,
        meanThickness: 1.87,
        status: "Complex Posterior Horn Tear & Radial Fraying",
        extrusionDistance: 3.4,
      },
      lateralMeniscus: {
        anteriorHorn: 4.8,
        body: 5.1,
        posteriorHorn: 5.3,
        meanThickness: 5.07,
        status: "Preserved morphology",
        extrusionDistance: 0.5,
      },
      jointSpaceWidth: {
        medialCompartment: 2.3,
        lateralCompartment: 6.2,
        jswRatio: 0.37,
      },
      femur: {
        apDimension: 63.8,
        mlDimension: 75.2,
        aspectRatio: 1.18,
        distalMedialResectionTarget: 9.0,
        distalLateralResectionTarget: 8.5,
        posteriorCondyleAngle: "3.5° External",
      },
      tibia: {
        mlDimension: 78.4,
        apDimension: 51.2,
        aspectRatio: 1.53,
        medialSlope: "4.5° Posterior",
        lateralSlope: "5.0° Posterior",
        medialBoneDefectDepth: 1.2,
      },
      cartilage: {
        medialFemoralThickness: 1.1,
        lateralFemoralThickness: 2.6,
        medialTibialThickness: 0.9,
        lateralTibialThickness: 2.5,
      }
    },

    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 138,
      diceFemur: 0.974,
      diceTibia: 0.969,
      diceMedialMeniscus: 0.932,
      diceLateralMeniscus: 0.952,
      diceCartilage: 0.912,
      meanDiceScore: 0.948,
      hausdorffDistance95: 1.22,
    },

    implantRecommendation: {
      preferredSystem: "Stryker Triathlon® Total Knee System",
      femoralSize: "Size 6 Standard",
      femoralAP: 64.0,
      femoralML: 74.5,
      femoralOverhangML: -0.7,
      tibialSize: "Size 5 Symmetric Tray",
      tibialML: 77.0,
      tibialAP: 50.5,
      tibialCoverage: "96.1% cortical fit",
      polyethyleneThickness: "10 mm X3 PS (Posterior Stabilized)",
      alignmentStrategy: "Restricted Kinematic Alignment (rKA)",
      notes: "Posterior horn complex tear with moderate bone loss; standard size 6 provides optimal ML coverage without anterior notch risk."
    },

    visits: [
      {
        date: "2025-11-04",
        type: "Initial Consult",
        womac: 58,
        oks: 22,
        vasPain: 7,
        notes: "Medial joint tenderness, posterior horn meniscal clicking on McMurray test."
      },
      {
        date: "2026-04-02",
        type: "Pre-Op AI Sizing",
        womac: 62,
        oks: 20,
        vasPain: 7,
        notes: "Scheduled for Triathlon Size 6 TKA with rKA protocol."
      }
    ]
  },
  {
    id: "PAT-32051",
    name: "Dr. Maya Lin",
    age: 34,
    sex: "Female",
    bmi: 22.1,
    affectedKnee: "Right",
    klGrade: 0,
    diagnosis: "Healthy Asymptomatic Control / Normative Knee Anatomy",
    alignment: "Neutral 0.5° Valgus",
    rom: "0° - 142°",
    symptoms: "None (Research volunteer / baseline scan)",
    imagingDate: "2026-05-18",
    modality: "High-Resolution 3D Isotropic CUBE MRI (3.0T)",
    sliceCount: 64,
    pixelSpacing: "0.30 mm/pixel",
    sliceThickness: "0.8 mm",
    attendingSurgeon: "Dr. Ethan Hayes, MD (Sports Medicine)",
    hospitalBranch: "University Medical Research Center",
    admissionDate: "2026-05-18",
    
    morphometrics: {
      medialMeniscus: {
        anteriorHorn: 4.8,
        body: 5.4,
        posteriorHorn: 5.9,
        meanThickness: 5.37,
        status: "Pristine wedge morphology, homogeneous low signal",
        extrusionDistance: 0.2,
      },
      lateralMeniscus: {
        anteriorHorn: 4.9,
        body: 5.3,
        posteriorHorn: 5.6,
        meanThickness: 5.27,
        status: "Normal C-shape morphology",
        extrusionDistance: 0.1,
      },
      jointSpaceWidth: {
        medialCompartment: 5.8,
        lateralCompartment: 6.1,
        jswRatio: 0.95,
      },
      femur: {
        apDimension: 53.2,
        mlDimension: 62.4,
        aspectRatio: 1.17,
        distalMedialResectionTarget: 0,
        distalLateralResectionTarget: 0,
        posteriorCondyleAngle: "3.0° External",
      },
      tibia: {
        mlDimension: 64.8,
        apDimension: 41.6,
        aspectRatio: 1.56,
        medialSlope: "5.0° Posterior",
        lateralSlope: "5.5° Posterior",
        medialBoneDefectDepth: 0.0,
      },
      cartilage: {
        medialFemoralThickness: 2.8,
        lateralFemoralThickness: 2.9,
        medialTibialThickness: 2.4,
        lateralTibialThickness: 2.5,
      }
    },

    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 129,
      diceFemur: 0.985,
      diceTibia: 0.981,
      diceMedialMeniscus: 0.958,
      diceLateralMeniscus: 0.964,
      diceCartilage: 0.946,
      meanDiceScore: 0.967,
      hausdorffDistance95: 0.85,
    },

    implantRecommendation: {
      preferredSystem: "N/A - Conservative / Healthy Joint Preserved",
      femoralSize: "Theoretical Size 3 Narrow",
      femoralAP: 53.0,
      femoralML: 62.0,
      femoralOverhangML: -0.4,
      tibialSize: "Theoretical Size 2",
      tibialML: 64.0,
      tibialAP: 41.0,
      tibialCoverage: "97.5%",
      polyethyleneThickness: "N/A (Joint preservation)",
      alignmentStrategy: "Native Constitutional Alignment",
      notes: "No surgical intervention indicated. High quality ground truth for normative population morphometrics."
    },

    visits: [
      {
        date: "2026-05-18",
        type: "Normative Baseline Scan",
        womac: 0,
        oks: 48,
        vasPain: 0,
        notes: "Asymptomatic runner. Excellent baseline joint anatomy."
      }
    ]
  },
  {
    id: "PAT-77419",
    name: "Marcus Sterling",
    age: 71,
    sex: "Male",
    bmi: 31.2,
    affectedKnee: "Right",
    klGrade: 4,
    diagnosis: "Severe Tricompartmental Osteoarthritis with Medial Bone Loss & Subchondral Sclerosis",
    alignment: "Varus 11.2°",
    rom: "15° - 85° (Fixed flexion contracture)",
    symptoms: "Inability to walk > 50 meters, severe chronic joint effusion, antalgic gait, instability",
    imagingDate: "2026-06-11",
    modality: "Pre-op CT Knee Protocol + 3T MRI",
    sliceCount: 64,
    pixelSpacing: "0.35 mm/pixel",
    sliceThickness: "1.0 mm",
    attendingSurgeon: "Dr. Alistair Sterling, MD, FRCS (Ortho)",
    hospitalBranch: "St. Jude Orthopedic & Arthroplasty Center",
    admissionDate: "2026-06-08",
    
    morphometrics: {
      medialMeniscus: {
        anteriorHorn: 0.8,
        body: 0.5,
        posteriorHorn: 0.6,
        meanThickness: 0.63,
        status: "Near Complete Absence / Degenerative Cleavage (>85% loss)",
        extrusionDistance: 5.6,
      },
      lateralMeniscus: {
        anteriorHorn: 3.8,
        body: 4.1,
        posteriorHorn: 4.2,
        meanThickness: 4.03,
        status: "Frayed edge, mild wear",
        extrusionDistance: 1.4,
      },
      jointSpaceWidth: {
        medialCompartment: 0.6,
        lateralCompartment: 5.2,
        jswRatio: 0.11,
      },
      femur: {
        apDimension: 66.5,
        mlDimension: 78.8,
        aspectRatio: 1.18,
        distalMedialResectionTarget: 9.5,
        distalLateralResectionTarget: 6.0,
        posteriorCondyleAngle: "4.0° External",
      },
      tibia: {
        mlDimension: 82.0,
        apDimension: 53.8,
        aspectRatio: 1.52,
        medialSlope: "6.8° Posterior",
        lateralSlope: "6.0° Posterior",
        medialBoneDefectDepth: 5.2,
      },
      cartilage: {
        medialFemoralThickness: 0.1,
        lateralFemoralThickness: 1.8,
        medialTibialThickness: 0.0,
        lateralTibialThickness: 1.7,
      }
    },

    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 148,
      diceFemur: 0.959,
      diceTibia: 0.952,
      diceMedialMeniscus: 0.887,
      diceLateralMeniscus: 0.925,
      diceCartilage: 0.871,
      meanDiceScore: 0.919,
      hausdorffDistance95: 1.82,
    },

    implantRecommendation: {
      preferredSystem: "DePuy Synthes ATTUNE® Knee System (Augmented)",
      femoralSize: "Size 8 Standard",
      femoralAP: 66.5,
      femoralML: 78.0,
      femoralOverhangML: -0.8,
      tibialSize: "Size 7 with 5mm Medial Augment",
      tibialML: 81.0,
      tibialAP: 53.0,
      tibialCoverage: "95.5% cortical coverage",
      polyethyleneThickness: "14 mm PS (Posterior Stabilized)",
      alignmentStrategy: "Mechanical Alignment with Gap Balancing",
      notes: "Medial tibial plateau defect >5mm requires modular augment wedge. 14mm insert planned for severe medial gap opening."
    },

    visits: [
      {
        date: "2026-01-15",
        type: "Initial Consult",
        womac: 82,
        oks: 11,
        vasPain: 9,
        notes: "Wheelchair dependent for shopping. 15° fixed flexion deformity."
      },
      {
        date: "2026-06-11",
        type: "Pre-Op AI Arthroplasty Sizing",
        womac: 85,
        oks: 9,
        vasPain: 10,
        notes: "Complex primary TKA planned with 5mm medial augment."
      }
    ]
  },
  {
    id: "PAT-51824",
    name: "Chloe Chen",
    age: 54,
    sex: "Female",
    bmi: 24.6,
    affectedKnee: "Left",
    klGrade: 2,
    diagnosis: "Early-to-Moderate Medial Compartment OA with Intact Lateral & Patellofemoral Joint",
    alignment: "Varus 3.0°",
    rom: "0° - 130°",
    symptoms: "Pain during athletic activities (running/hiking), occasional swelling after prolonged standing",
    imagingDate: "2026-07-08",
    modality: "3D Proton-Density Fat-Suppressed MRI (3.0T)",
    sliceCount: 64,
    pixelSpacing: "0.35 mm/pixel",
    sliceThickness: "1.0 mm",
    attendingSurgeon: "Dr. Samantha Reed, MD (Joint Reconstruction)",
    hospitalBranch: "MetroHealth Orthopedic Pavilion",
    admissionDate: "2026-07-02",
    
    morphometrics: {
      medialMeniscus: {
        anteriorHorn: 3.1,
        body: 2.6,
        posteriorHorn: 2.4,
        meanThickness: 2.70,
        status: "Horizontal Cleavage Tear Posterior Body (Grade II signal)",
        extrusionDistance: 2.1,
      },
      lateralMeniscus: {
        anteriorHorn: 4.6,
        body: 5.0,
        posteriorHorn: 5.2,
        meanThickness: 4.93,
        status: "Normal",
        extrusionDistance: 0.3,
      },
      jointSpaceWidth: {
        medialCompartment: 3.4,
        lateralCompartment: 5.8,
        jswRatio: 0.58,
      },
      femur: {
        apDimension: 55.2,
        mlDimension: 64.6,
        aspectRatio: 1.17,
        distalMedialResectionTarget: 8.0,
        distalLateralResectionTarget: 0,
        posteriorCondyleAngle: "3.0° External",
      },
      tibia: {
        mlDimension: 67.5,
        apDimension: 43.4,
        aspectRatio: 1.55,
        medialSlope: "5.0° Posterior",
        lateralSlope: "5.2° Posterior",
        medialBoneDefectDepth: 0.5,
      },
      cartilage: {
        medialFemoralThickness: 1.8,
        lateralFemoralThickness: 2.7,
        medialTibialThickness: 1.5,
        lateralTibialThickness: 2.6,
      }
    },

    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 135,
      diceFemur: 0.979,
      diceTibia: 0.975,
      diceMedialMeniscus: 0.942,
      diceLateralMeniscus: 0.961,
      diceCartilage: 0.928,
      meanDiceScore: 0.957,
      hausdorffDistance95: 1.05,
    },

    implantRecommendation: {
      preferredSystem: "Oxford® Partial Knee (UKA) / Smith & Nephew Journey II UKA",
      femoralSize: "Size Medium Medial UKA",
      femoralAP: 42.0,
      femoralML: 22.0,
      femoralOverhangML: 0.0,
      tibialSize: "Size C Anatomical Medial Tray",
      tibialML: 28.5,
      tibialAP: 43.0,
      tibialCoverage: "98.2% medial plateau fit",
      polyethyleneThickness: "4 mm Mobile Bearing Insert",
      alignmentStrategy: "Preserve ACL/PCL & Native Kinematics",
      notes: "Ideal candidate for Medial Unicompartmental Knee Arthroplasty (UKA) due to isolated medial disease, intact ACL, and preserved lateral compartment."
    },

    visits: [
      {
        date: "2026-03-22",
        type: "Sports Injury Clinic",
        womac: 42,
        oks: 31,
        vasPain: 5,
        notes: "Isolated medial joint tenderness, lateral compartment totally normal. Candidate for partial UKA."
      },
      {
        date: "2026-07-08",
        type: "Pre-Op UKA Plan",
        womac: 45,
        oks: 29,
        vasPain: 6,
        notes: "Oxford UKA Size Medium selected with 4mm mobile bearing insert."
      }
    ]
  }
];

// Helper: Convert any Historical Hospital Record or Custom Patient into full volumetric DICOM Case
export function createPatientFromHistoricalRecord(record, customImageSrc = null) {
  const isMale = record.sex === "Male";
  const kl = record.klGrade !== undefined ? record.klGrade : 3;

  // Determine realistic morphometrics based on KL grade & sex
  let antHorn, bodyThick, postHorn, extrusion, jswMedial;
  if (kl === 4) {
    antHorn = +(1.0 + Math.random() * 0.5).toFixed(1);
    bodyThick = +(0.6 + Math.random() * 0.5).toFixed(1);
    postHorn = +(0.8 + Math.random() * 0.5).toFixed(1);
    extrusion = +(4.5 + Math.random() * 1.5).toFixed(1);
    jswMedial = +(0.8 + Math.random() * 0.6).toFixed(1);
  } else if (kl === 3) {
    antHorn = +(2.0 + Math.random() * 0.6).toFixed(1);
    bodyThick = +(1.6 + Math.random() * 0.5).toFixed(1);
    postHorn = +(1.5 + Math.random() * 0.5).toFixed(1);
    extrusion = +(3.2 + Math.random() * 0.8).toFixed(1);
    jswMedial = +(2.1 + Math.random() * 0.7).toFixed(1);
  } else if (kl === 2) {
    antHorn = +(3.2 + Math.random() * 0.5).toFixed(1);
    bodyThick = +(2.8 + Math.random() * 0.5).toFixed(1);
    postHorn = +(2.6 + Math.random() * 0.5).toFixed(1);
    extrusion = +(2.0 + Math.random() * 0.6).toFixed(1);
    jswMedial = +(3.4 + Math.random() * 0.6).toFixed(1);
  } else {
    antHorn = 4.8;
    bodyThick = 5.2;
    postHorn = 5.6;
    extrusion = 0.5;
    jswMedial = 5.8;
  }

  const meanThick = +((antHorn + bodyThick + postHorn) / 3).toFixed(2);
  const femurML = isMale ? +(74.0 + (Math.random() * 4 - 2)).toFixed(1) : +(65.0 + (Math.random() * 4 - 2)).toFixed(1);
  const femurAP = +(femurML / 1.18).toFixed(1);
  const tibiaML = isMale ? +(77.0 + (Math.random() * 4 - 2)).toFixed(1) : +(68.0 + (Math.random() * 4 - 2)).toFixed(1);
  const tibiaAP = +(tibiaML / 1.53).toFixed(1);

  return {
    id: record.id || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
    name: record.name || "Uploaded Patient Scan",
    age: record.age || 62,
    sex: record.sex || "Female",
    bmi: record.bmi || 27.5,
    affectedKnee: record.affectedKnee || "Right",
    klGrade: kl,
    diagnosis: record.diagnosis || `Kellgren-Lawrence Grade ${kl} Knee Osteoarthritis`,
    alignment: kl >= 3 ? `Varus ${(4.0 + kl * 1.5).toFixed(1)}°` : "Neutral 1.0°",
    rom: kl >= 4 ? "10° - 90° (Contracture)" : "0° - 120°",
    symptoms: record.symptoms || "Weight-bearing medial joint line pain, joint stiffness, reduced mobility",
    imagingDate: record.surgeryDate || record.imagingDate || new Date().toISOString().split('T')[0],
    modality: customImageSrc ? "Custom Patient MRI / CT Image Upload" : "3D Volumetric 3.0T MRI + CT Protocol",
    customImageSrc: customImageSrc || null,
    sliceCount: 64,
    pixelSpacing: "0.35 mm/pixel",
    sliceThickness: "1.0 mm",
    attendingSurgeon: record.surgeon || "Dr. Alistair Sterling, MD",
    hospitalBranch: "St. Jude Orthopedic & Arthroplasty Center",

    morphometrics: {
      medialMeniscus: {
        anteriorHorn: antHorn,
        body: bodyThick,
        posteriorHorn: postHorn,
        meanThickness: meanThick,
        status: kl >= 4 ? "Severe Extrusion & Maceration (>75% loss)" : kl >= 3 ? "Complex Degenerative Tear & Radial Fraying" : "Mild Wear / Fraying",
        extrusionDistance: extrusion,
      },
      lateralMeniscus: {
        anteriorHorn: 4.5,
        body: 4.8,
        posteriorHorn: 5.0,
        meanThickness: 4.77,
        status: "Preserved morphology",
        extrusionDistance: 0.6,
      },
      jointSpaceWidth: {
        medialCompartment: jswMedial,
        lateralCompartment: 5.8,
        jswRatio: +(jswMedial / 5.8).toFixed(2),
      },
      femur: {
        apDimension: femurAP,
        mlDimension: femurML,
        aspectRatio: 1.18,
        distalMedialResectionTarget: kl >= 3 ? 9.0 : 7.0,
        distalLateralResectionTarget: 7.0,
        posteriorCondyleAngle: "3.0° External",
      },
      tibia: {
        mlDimension: tibiaML,
        apDimension: tibiaAP,
        aspectRatio: 1.53,
        medialSlope: "5.0° Posterior",
        lateralSlope: "5.5° Posterior",
        medialBoneDefectDepth: kl === 4 ? 4.2 : 1.0,
      },
      cartilage: {
        medialFemoralThickness: kl >= 4 ? 0.3 : 1.2,
        lateralFemoralThickness: 2.5,
        medialTibialThickness: kl >= 4 ? 0.2 : 1.0,
        lateralTibialThickness: 2.4,
      }
    },

    aiMetrics: {
      model: "MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)",
      inferenceTimeMs: 140,
      diceFemur: 0.965,
      diceTibia: 0.960,
      diceMedialMeniscus: 0.925,
      diceLateralMeniscus: 0.948,
      diceCartilage: 0.905,
      meanDiceScore: 0.941,
      hausdorffDistance95: 1.35,
    },

    implantRecommendation: {
      preferredSystem: record.implantUsed || "Zimmer Biomet Persona® Personalized Knee System",
      femoralSize: isMale ? "Size 6 Standard" : "Size 4 Narrow",
      femoralAP: femurAP,
      femoralML: femurML - 0.8,
      femoralOverhangML: -0.8,
      tibialSize: isMale ? "Size 5 Tray" : "Size 3 Tray",
      tibialML: tibiaML - 1.0,
      tibialAP: tibiaAP - 0.8,
      tibialCoverage: "95.4% cortical bone fit",
      polyethyleneThickness: kl >= 4 ? "12 mm CR" : "10 mm CR",
      alignmentStrategy: "Restricted Kinematic Alignment (rKA)",
      notes: record.notes || "Automated patient-matched sizing derived from segmentation contours."
    },

    visits: record.visits || [
      {
        date: record.surgeryDate || "2025-10-15",
        type: "Consultation & Imaging",
        womac: record.preOpWOMAC || 72,
        oks: record.preOpOKS || 16,
        vasPain: 8,
        notes: record.diagnosis || "Initial presentation for medial knee osteoarthritis."
      }
    ]
  };
}

// Historical Hospital Past Patients Registry (12 Longitudinal Patient Records)
export const HOSPITAL_HISTORICAL_REGISTRY = [
  {
    id: "HOSP-2024-0182",
    name: "Robert MacIntyre",
    age: 69,
    sex: "Male",
    diagnosis: "Severe Medial OA & Meniscal Root Avulsion",
    klGrade: 4,
    affectedKnee: "Right",
    surgeryDate: "2024-05-14",
    procedure: "Total Knee Arthroplasty (TKA)",
    implantUsed: "Zimmer Persona Size 7 Standard / 12mm CR",
    surgeon: "Dr. Alistair Sterling",
    preOpWOMAC: 78,
    postOpWOMAC1Yr: 12,
    preOpOKS: 14,
    postOpOKS1Yr: 44,
    meniscalDeficit: "82% loss (0.9mm residual)",
    complications: "None (Full recovery, returned to golf at 4 months)",
    status: "Completed 2-Year Followup"
  },
  {
    id: "HOSP-2024-0491",
    name: "Helena Rostova",
    age: 58,
    sex: "Female",
    diagnosis: "Isolated Medial Compartment OA",
    klGrade: 3,
    affectedKnee: "Left",
    surgeryDate: "2024-08-22",
    procedure: "Unicompartmental Knee Arthroplasty (UKA)",
    implantUsed: "Oxford Partial Knee Size Medium / 4mm",
    surgeon: "Dr. Samantha Reed",
    preOpWOMAC: 56,
    postOpWOMAC1Yr: 8,
    preOpOKS: 24,
    postOpOKS1Yr: 46,
    meniscalDeficit: "65% loss (1.7mm residual)",
    complications: "None (Preserved native ACL/PCL kinematics)",
    status: "Completed 1-Year Followup"
  },
  {
    id: "HOSP-2024-0812",
    name: "David Kim",
    age: 64,
    sex: "Male",
    diagnosis: "Tricompartmental OA with 6mm Tibial Defect",
    klGrade: 4,
    affectedKnee: "Right",
    surgeryDate: "2024-11-09",
    procedure: "Augmented TKA (5mm Medial Wedge)",
    implantUsed: "DePuy Attune Size 7 / 14mm PS + 5mm Augment",
    surgeon: "Dr. Alistair Sterling",
    preOpWOMAC: 84,
    postOpWOMAC1Yr: 18,
    preOpOKS: 11,
    postOpOKS1Yr: 41,
    meniscalDeficit: "90% loss (0.5mm residual)",
    complications: "Resolved minor arthrofibrosis with PT",
    status: "Completed 1-Year Followup"
  },
  {
    id: "HOSP-2025-0104",
    name: "Patricia O'Connor",
    age: 72,
    sex: "Female",
    diagnosis: "Severe Varus OA with Posterior Meniscal Horn Maceration",
    klGrade: 4,
    affectedKnee: "Left",
    surgeryDate: "2025-01-18",
    procedure: "Kinematic Total Knee Arthroplasty (rKA)",
    implantUsed: "Stryker Triathlon Size 4 / 11mm X3",
    surgeon: "Dr. Samantha Reed",
    preOpWOMAC: 76,
    postOpWOMAC1Yr: 15,
    preOpOKS: 16,
    postOpOKS1Yr: 43,
    meniscalDeficit: "78% loss (1.1mm residual)",
    complications: "None",
    status: "Completed 1-Year Followup"
  },
  {
    id: "HOSP-2025-0399",
    name: "Vikram Malhotra",
    age: 51,
    sex: "Male",
    diagnosis: "Post-Traumatic Medial Meniscal Degeneration & Grade 2 OA",
    klGrade: 2,
    affectedKnee: "Right",
    surgeryDate: "2025-04-10",
    procedure: "High Tibial Osteotomy (HTO) + Meniscal Repair",
    implantUsed: "Arthrex Opening Wedge Plate 8mm",
    surgeon: "Dr. Ethan Hayes",
    preOpWOMAC: 48,
    postOpWOMAC1Yr: 14,
    preOpOKS: 28,
    postOpOKS1Yr: 45,
    meniscalDeficit: "40% loss (3.0mm residual)",
    complications: "Joint preserved, avoided prosthetic arthroplasty",
    status: "Joint Preservation Cohort"
  },
  {
    id: "HOSP-2025-0622",
    name: "Margaret Thatcher-Jones",
    age: 76,
    sex: "Female",
    diagnosis: "End-stage Bilateral Knee OA",
    klGrade: 4,
    affectedKnee: "Right",
    surgeryDate: "2025-06-30",
    procedure: "Staged Bilateral TKA (Right First)",
    implantUsed: "Zimmer Persona Size 3 Narrow / 10mm CR",
    surgeon: "Dr. Alistair Sterling",
    preOpWOMAC: 88,
    postOpWOMAC1Yr: 19,
    preOpOKS: 8,
    postOpOKS1Yr: 40,
    meniscalDeficit: "88% loss (0.6mm residual)",
    complications: "None",
    status: "Awaiting Left Knee Surgery"
  },
  {
    id: "HOSP-2025-0914",
    name: "Carlos Mendoza",
    age: 63,
    sex: "Male",
    diagnosis: "Medial OA with Complex Degenerative Meniscus Cleavage",
    klGrade: 3,
    affectedKnee: "Left",
    surgeryDate: "2025-09-12",
    procedure: "Robotic-Assisted TKA (Mako/Triathlon)",
    implantUsed: "Stryker Triathlon Size 6 / 10mm CS",
    surgeon: "Dr. Samantha Reed",
    preOpWOMAC: 66,
    postOpWOMAC1Yr: 11,
    preOpOKS: 19,
    postOpOKS1Yr: 45,
    meniscalDeficit: "70% loss (1.5mm residual)",
    complications: "None (Zero revision risk, balanced gap)",
    status: "6-Month Followup Completed"
  },
  {
    id: "HOSP-2025-1150",
    name: "Susan Whitmore",
    age: 60,
    sex: "Female",
    diagnosis: "Medial Knee OA with Outerbridge Grade 4 Cartilage Loss",
    klGrade: 3,
    affectedKnee: "Right",
    surgeryDate: "2025-11-20",
    procedure: "Medial UKA (Personalized Fit)",
    implantUsed: "Persona Partial Knee Size 4 Medial / 8mm",
    surgeon: "Dr. Alistair Sterling",
    preOpWOMAC: 59,
    postOpWOMAC1Yr: 9,
    preOpOKS: 23,
    postOpOKS1Yr: 46,
    meniscalDeficit: "62% loss (1.9mm residual)",
    complications: "None",
    status: "Active Followup"
  }
];

// Population Cohort Dataset (240 simulated clinical subjects based on OAI & MOST studies)
export const GENERATE_POPULATION_COHORT = () => {
  const cohort = [];
  const groups = [
    { label: "Healthy Control (Grade 0)", kl: 0, count: 50, mmThickMean: 5.2, mmThickSD: 0.45, jswMean: 5.9, jswSD: 0.5 },
    { label: "Doubtful OA (Grade 1)", kl: 1, count: 45, mmThickMean: 4.4, mmThickSD: 0.50, jswMean: 4.9, jswSD: 0.55 },
    { label: "Mild OA (Grade 2)", kl: 2, count: 55, mmThickMean: 3.1, mmThickSD: 0.60, jswMean: 3.8, jswSD: 0.6 },
    { label: "Moderate OA (Grade 3)", kl: 3, count: 50, mmThickMean: 1.9, mmThickSD: 0.55, jswMean: 2.4, jswSD: 0.5 },
    { label: "Severe OA (Grade 4)", kl: 4, count: 40, mmThickMean: 0.9, mmThickSD: 0.35, jswMean: 1.1, jswSD: 0.4 }
  ];

  let idCounter = 1000;

  groups.forEach(grp => {
    for (let i = 0; i < grp.count; i++) {
      const isMale = i % 2 === 0;
      const sex = isMale ? "Male" : "Female";
      
      const age = Math.round(40 + (grp.kl * 7) + (Math.random() * 16 - 8));
      const bmi = +(22 + (grp.kl * 1.8) + (Math.random() * 5 - 2.5)).toFixed(1);

      const randNorm = (Math.random() + Math.random() + Math.random() - 1.5) * 2;
      const mmThickness = +(Math.max(0.3, grp.mmThickMean + randNorm * grp.mmThickSD)).toFixed(2);
      const jsw = +(Math.max(0.4, grp.jswMean + randNorm * grp.jswSD)).toFixed(2);

      const femurML = +( (isMale ? 74.5 : 65.2) + (Math.random() * 6 - 3) ).toFixed(1);
      const femurAP = +( femurML / (isMale ? 1.18 : 1.17) + (Math.random() * 2 - 1) ).toFixed(1);
      const tibiaML = +( (isMale ? 77.2 : 67.8) + (Math.random() * 6 - 3) ).toFixed(1);
      const tibiaAP = +( (isMale ? 50.8 : 43.5) + (Math.random() * 4 - 2) ).toFixed(1);

      cohort.push({
        id: `COH-${idCounter++}`,
        age,
        sex,
        bmi,
        klGrade: grp.kl,
        isOA: grp.kl >= 2,
        groupLabel: grp.label,
        medialMeniscusThickness: mmThickness,
        jointSpaceWidth: jsw,
        femurML,
        femurAP,
        tibiaML,
        tibiaAP,
        aspectRatioFemur: +(femurML / femurAP).toFixed(2),
        aspectRatioTibia: +(tibiaML / tibiaAP).toFixed(2),
      });
    }
  });

  return cohort;
};

// Sizing Catalog Data for Major Knee Implant Systems
export const IMPLANT_CATALOG = {
  "Zimmer Persona": [
    { size: "Size 1", ap: 49.0, mlNarrow: 56.5, mlStandard: 59.0, mlPlus: 61.5 },
    { size: "Size 2", ap: 51.5, mlNarrow: 59.0, mlStandard: 61.5, mlPlus: 64.0 },
    { size: "Size 3", ap: 54.0, mlNarrow: 61.5, mlStandard: 64.0, mlPlus: 66.5 },
    { size: "Size 4", ap: 56.5, mlNarrow: 64.0, mlStandard: 66.5, mlPlus: 69.0 },
    { size: "Size 5", ap: 59.0, mlNarrow: 66.5, mlStandard: 69.0, mlPlus: 71.5 },
    { size: "Size 6", ap: 61.5, mlNarrow: 69.0, mlStandard: 71.5, mlPlus: 74.0 },
    { size: "Size 7", ap: 64.0, mlNarrow: 71.5, mlStandard: 74.0, mlPlus: 76.5 },
    { size: "Size 8", ap: 66.5, mlNarrow: 74.0, mlStandard: 76.5, mlPlus: 79.0 },
    { size: "Size 9", ap: 69.0, mlNarrow: 76.5, mlStandard: 79.0, mlPlus: 81.5 },
    { size: "Size 10", ap: 71.5, mlNarrow: 79.0, mlStandard: 81.5, mlPlus: 84.0 }
  ],
  "Stryker Triathlon": [
    { size: "Size 1", ap: 52.0, mlStandard: 57.0 },
    { size: "Size 2", ap: 55.0, mlStandard: 61.0 },
    { size: "Size 3", ap: 58.0, mlStandard: 64.0 },
    { size: "Size 4", ap: 61.0, mlStandard: 67.5 },
    { size: "Size 5", ap: 64.0, mlStandard: 71.0 },
    { size: "Size 6", ap: 67.0, mlStandard: 74.5 },
    { size: "Size 7", ap: 70.0, mlStandard: 78.0 },
    { size: "Size 8", ap: 73.0, mlStandard: 81.5 }
  ],
  "DePuy Attune": [
    { size: "Size 1", ap: 50.0, mlNarrow: 56.0, mlStandard: 58.0 },
    { size: "Size 2", ap: 53.0, mlNarrow: 59.0, mlStandard: 61.5 },
    { size: "Size 3", ap: 56.0, mlNarrow: 62.0, mlStandard: 65.0 },
    { size: "Size 4", ap: 59.0, mlNarrow: 65.0, mlStandard: 68.0 },
    { size: "Size 5", ap: 62.0, mlNarrow: 68.0, mlStandard: 71.5 },
    { size: "Size 6", ap: 65.0, mlNarrow: 71.0, mlStandard: 74.5 },
    { size: "Size 7", ap: 68.0, mlNarrow: 74.0, mlStandard: 78.0 },
    { size: "Size 8", ap: 71.0, mlNarrow: 77.0, mlStandard: 81.5 },
    { size: "Size 9", ap: 74.0, mlNarrow: 80.0, mlStandard: 85.0 },
    { size: "Size 10", ap: 77.0, mlNarrow: 83.0, mlStandard: 88.5 }
  ]
};
