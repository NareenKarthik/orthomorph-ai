import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    affectedKnee: {
      type: String,
      enum: ['Left', 'Right', 'Bilateral'],
      default: 'Right',
    },
    klGrade: {
      type: Number,
      min: 0,
      max: 4,
      default: 3,
    },
    diagnosis: String,
    alignment: String,
    rom: String,
    symptoms: String,
    imagingDate: String,
    modality: String,
    sliceCount: Number,
    pixelSpacing: String,
    sliceThickness: String,
    attendingSurgeon: String,
    hospitalBranch: String,
    admissionDate: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    // Patient Detailed Biodata
    biodata: {
      bloodGroup: {
        type: String,
        default: 'O+',
      },
      heightCm: {
        type: Number,
        default: 168,
      },
      weightKg: {
        type: Number,
        default: 75,
      },
      dob: String,
      contactPhone: String,
      allergies: {
        type: String,
        default: 'None reported (Penicillin/Latex checked)',
      },
      previousSurgeries: {
        type: String,
        default: 'Right knee arthroscopy (2021)',
      },
      emergencyContact: String,
    },

    // Cross-Border Operation & Dispatched Surgical Element
    internationalDispatch: {
      country: {
        type: String,
        default: 'Germany',
      },
      countryCode: {
        type: String,
        default: 'DE',
      },
      countryFlag: {
        type: String,
        default: '🇩🇪',
      },
      destinationHospital: {
        type: String,
        default: 'Charité - Universitätsmedizin Berlin (Department of Orthopedics)',
      },
      dispatchedElement: {
        type: String,
        default: 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
      },
      elementCategory: {
        type: String,
        default: 'Patient-Specific Instrumentation (PSI)',
      },
      implantSpecs: {
        material: { type: String, default: 'Medical-Grade Ti-6Al-4V ELI (Direct Metal Laser Sintered)' },
        sterility: { type: String, default: 'Gamma Irradiated / SAL 10^-6' },
        customSizingRef: { type: String, default: 'Femur AP 56.4mm / Tibia ML 69.2mm' },
      },
      regulatoryClearance: {
        type: String,
        default: 'CE MDR (EU 2017/745) Class III Custom Implant & FDA 510(k)',
      },
      trackingNumber: {
        type: String,
        default: 'MED-EXP-84920-DE',
      },
      carrier: {
        type: String,
        default: 'DHL Medical Cold-Chain Priority Express',
      },
      dispatchStatus: {
        type: String,
        default: '3D Sintering in Cleanroom (Pre-Dispatch)',
      },
      estimatedArrival: {
        type: String,
        default: '2026-03-22 (48h prior to surgery)',
      },
      temperatureMonitoring: {
        type: String,
        default: '-80°C Cryo-Monitored / Active Data Logger',
      },
    },

    morphometrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    aiMetrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    implantRecommendation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    customImageSrc: String,
    surgicalNotes: String,
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
