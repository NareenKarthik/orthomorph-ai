import User from './models/User.js';
import Patient from './models/Patient.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial verified medical specialists to MongoDB...');

      const defaultUsers = [
        {
          name: 'Dr. Alistair Sterling',
          email: 'alistair.sterling@stjude-ortho.org',
          password: 'OrthoMorphDemo2026!',
          role: 'Surgeon',
          title: 'MD, FRCS (Ortho)',
          hospital: 'St. Jude Orthopedic & Arthroplasty Center',
          department: 'Adult Knee Reconstruction & Robotic Joint Surgery',
          licenseNumber: 'MD-778942-US',
          avatarColor: '#00f2fe',
        },
        {
          name: 'Dr. Elena Rostova',
          email: 'elena.rostova@stjude-ortho.org',
          password: 'OrthoMorphDemo2026!',
          role: 'Radiologist',
          title: 'MD, PhD (MSK Imaging)',
          hospital: 'St. Jude Diagnostic Imaging Institute',
          department: 'Musculoskeletal MRI & 3D Analytics',
          licenseNumber: 'RAD-662910-US',
          avatarColor: '#10b981',
        },
        {
          name: 'Dr. Marcus Chen',
          email: 'marcus.chen@orthomorph.ai',
          password: 'OrthoMorphDemo2026!',
          role: 'Biostatistician',
          title: 'PhD, Computational Biostatistics',
          hospital: 'OrthoMorph AI Research Consortium',
          department: 'Population Phenotyping & ML Analytics',
          licenseNumber: 'RES-440219-AI',
          avatarColor: '#f59e0b',
        },
      ];

      for (const u of defaultUsers) {
        const user = new User(u);
        await user.save();
      }
      console.log(`✅ Seeded ${defaultUsers.length} verified physicians into MongoDB.`);
    }

    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log('🌱 Seeding clinical patient cases into MongoDB...');
      const seedPatients = [
        {
          id: 'PAT-84920',
          name: 'Eleanor Vance',
          age: 67,
          sex: 'Female',
          bmi: 29.4,
          affectedKnee: 'Right',
          klGrade: 4,
          diagnosis: 'End-Stage Medial Compartment Knee Osteoarthritis with Severe Varus Deformity',
          alignment: 'Varus 8.5°',
          rom: '10° - 95° (Flexion contracture)',
          symptoms: 'Severe weight-bearing pain, night pain, crepitus, walking distance < 100m',
          imagingDate: '2026-03-14',
          modality: '3D Sagittal/Coronal 3.0T MRI + Weight-bearing CT',
          sliceCount: 64,
          pixelSpacing: '0.35 mm/pixel',
          sliceThickness: '1.0 mm',
          attendingSurgeon: 'Dr. Alistair Sterling, MD, FRCS (Ortho)',
          hospitalBranch: 'St. Jude Orthopedic & Arthroplasty Center',
          admissionDate: '2026-03-10',
          email: 'eleanor.vance@patient-portal.org',
          biodata: {
            bloodGroup: 'A+',
            heightCm: 165,
            weightKg: 80,
            dob: '1959-08-14',
            contactPhone: '+1 (555) 234-8920',
            allergies: 'Penicillin (Mild Rash), Shellfish',
            previousSurgeries: 'Right knee arthroscopy (2021), Lumbar L4-L5 discectomy',
            emergencyContact: 'Robert Vance (Son) - +1 (555) 982-1144',
          },
          internationalDispatch: {
            country: 'Germany',
            countryCode: 'DE',
            countryFlag: '🇩🇪',
            destinationHospital: 'Charité - Universitätsmedizin Berlin (Adult Knee Arthroplasty Center)',
            dispatchedElement: 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
            elementCategory: 'Patient-Specific Instrumentation (PSI)',
            implantSpecs: {
              material: 'Medical-Grade Ti-6Al-4V ELI (Direct Metal Laser Sintered)',
              sterility: 'Gamma Irradiated / SAL 10^-6',
              customSizingRef: 'Femur AP 56.4mm / Tibia ML 69.2mm',
            },
            regulatoryClearance: 'CE MDR (EU 2017/745) Class III Custom Implant & FDA 510(k)',
            trackingNumber: 'MED-EXP-84920-DE',
            carrier: 'DHL Medical Cold-Chain Priority Express',
            dispatchStatus: 'Customs Cleared • In Transit to Berlin Cleanroom',
            estimatedArrival: '2026-03-24 (48h prior to surgery)',
            temperatureMonitoring: '-80°C Cryo-Monitored / Active Temp Logger #DE-89',
          },
          morphometrics: {
            medialMeniscus: {
              anteriorHorn: 1.4,
              body: 0.9,
              posteriorHorn: 1.1,
              meanThickness: 1.13,
              status: 'Severe Extrusion & Maceration (>75% volume loss)',
              extrusionDistance: 4.8,
            },
            lateralMeniscus: {
              anteriorHorn: 4.2,
              body: 4.6,
              posteriorHorn: 4.8,
              meanThickness: 4.53,
              status: 'Intact, preserved height',
              extrusionDistance: 0.8,
            },
            jointSpaceWidth: {
              medialCompartment: 1.2,
              lateralCompartment: 5.6,
              jswRatio: 0.21,
            },
            femur: {
              apDimension: 56.4,
              mlDimension: 66.8,
              aspectRatio: 1.18,
              distalMedialResectionTarget: 9.0,
              distalLateralResectionTarget: 7.0,
              posteriorCondyleAngle: '3° External',
            },
            tibia: {
              mlDimension: 69.2,
              apDimension: 44.8,
              aspectRatio: 1.54,
              medialSlope: '5.5° Posterior',
              lateralSlope: '6.0° Posterior',
              medialBoneDefectDepth: 3.5,
            },
            cartilage: {
              medialFemoralThickness: 0.4,
              lateralFemoralThickness: 2.3,
              medialTibialThickness: 0.2,
              lateralTibialThickness: 2.1,
            },
          },
          aiMetrics: {
            model: 'MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)',
            inferenceTimeMs: 142,
            diceFemur: 0.968,
            diceTibia: 0.962,
            diceMedialMeniscus: 0.914,
            diceLateralMeniscus: 0.941,
            diceCartilage: 0.898,
            meanDiceScore: 0.937,
            hausdorffDistance95: 1.45,
          },
          implantRecommendation: {
            preferredSystem: 'Zimmer Biomet Persona® Personalized Knee System',
            femoralSize: 'Size 4 (Narrow/Standard)',
            femoralAP: 56.5,
            femoralML: 66.0,
            femoralOverhangML: -0.8,
            tibialSize: 'Size 3 (Medialized Tray)',
            tibialML: 68.5,
            tibialAP: 44.0,
            tibialCoverage: '94.8% cortical bone fit',
            polyethyleneThickness: '12 mm CR (Cruciate Retaining / UC)',
            alignmentStrategy: 'Kinematic Alignment (Target 3° Varus Residual)',
            notes: 'Severe medial wear requires 12mm insert to restore medial joint line without over-tightening flexion gap.',
          },
        },
        {
          id: 'PAT-90312',
          name: 'Arthur Pendelton',
          age: 62,
          sex: 'Male',
          bmi: 27.8,
          affectedKnee: 'Left',
          klGrade: 3,
          diagnosis: 'Moderate-to-Severe Tricompartmental OA with Lateral Meniscal Degeneration',
          alignment: 'Valgus 4.2°',
          rom: '0° - 115°',
          symptoms: 'Lateral joint line tenderness, instability on descending stairs',
          imagingDate: '2026-03-12',
          modality: 'High-Res 3.0T MRI Knee Protocol',
          sliceCount: 64,
          pixelSpacing: '0.35 mm/pixel',
          sliceThickness: '1.0 mm',
          attendingSurgeon: 'Dr. Alistair Sterling, MD, FRCS (Ortho)',
          hospitalBranch: 'St. Jude Orthopedic & Arthroplasty Center',
          admissionDate: '2026-03-08',
          morphometrics: {
            medialMeniscus: {
              anteriorHorn: 3.5,
              body: 3.4,
              posteriorHorn: 3.8,
              meanThickness: 3.57,
              status: 'Mild signal change, preserved height',
              extrusionDistance: 1.2,
            },
            lateralMeniscus: {
              anteriorHorn: 2.1,
              body: 1.6,
              posteriorHorn: 1.9,
              meanThickness: 1.87,
              status: 'Moderate Extrusion & Complex Horizontal Tear',
              extrusionDistance: 3.9,
            },
            jointSpaceWidth: {
              medialCompartment: 4.8,
              lateralCompartment: 2.1,
              jswRatio: 2.28,
            },
            femur: {
              apDimension: 62.1,
              mlDimension: 73.4,
              aspectRatio: 1.18,
              distalMedialResectionTarget: 8.5,
              distalLateralResectionTarget: 9.5,
              posteriorCondyleAngle: '3° External',
            },
            tibia: {
              mlDimension: 75.8,
              apDimension: 49.2,
              aspectRatio: 1.54,
              medialSlope: '6.0° Posterior',
              lateralSlope: '5.0° Posterior',
              medialBoneDefectDepth: 1.2,
            },
            cartilage: {
              medialFemoralThickness: 2.0,
              lateralFemoralThickness: 0.8,
              medialTibialThickness: 1.9,
              lateralTibialThickness: 0.6,
            },
          },
          aiMetrics: {
            model: 'MONAI 3D Swin-UNETR (PyTorch 2.4 / CUDA)',
            inferenceTimeMs: 138,
            diceFemur: 0.971,
            diceTibia: 0.965,
            diceMedialMeniscus: 0.932,
            diceLateralMeniscus: 0.925,
            diceCartilage: 0.912,
            meanDiceScore: 0.941,
            hausdorffDistance95: 1.38,
          },
          implantRecommendation: {
            preferredSystem: 'Stryker Triathlon® Knee System',
            femoralSize: 'Size 6 (Standard)',
            femoralAP: 62.0,
            femoralML: 73.0,
            femoralOverhangML: -0.4,
            tibialSize: 'Size 5 (Rotational Platform)',
            tibialML: 75.0,
            tibialAP: 49.0,
            tibialCoverage: '96.2% cortical bone fit',
            polyethyleneThickness: '10 mm PS (Posterior Stabilized)',
            alignmentStrategy: 'Mechanical Alignment (0° Neutral)',
            notes: 'Lateral release recommended if flexion gap asymmetry exceeds 2mm.',
          },
        },
      ];

      for (const p of seedPatients) {
        await Patient.findOneAndUpdate({ id: p.id }, p, { upsert: true });
      }
      console.log(`✅ Seeded ${seedPatients.length} patient cases into MongoDB.`);
    }
  } catch (err) {
    console.error('Seed Error:', err.message);
  }
};
