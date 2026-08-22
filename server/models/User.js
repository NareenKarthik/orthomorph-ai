import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Physician name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Institutional email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid institutional email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['Surgeon', 'Radiologist', 'Biostatistician', 'Orthopedic Fellow', 'Admin', 'Researcher', 'Patient'],
      default: 'Surgeon',
    },
    title: {
      type: String,
      default: 'MD, FRCS (Ortho)',
    },
    hospital: {
      type: String,
      default: 'St. Jude Orthopedic & Arthroplasty Center',
    },
    department: {
      type: String,
      default: 'Adult Reconstruction & Joint Replacement',
    },
    licenseNumber: {
      type: String,
      default: 'MED-98420-OR',
    },
    avatar: {
      type: String,
      default: '',
    },
    avatarColor: {
      type: String,
      default: '#00f2fe',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: true,
    },
    twoFactorCode: {
      type: String,
      default: null,
    },
    twoFactorExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe representation without password
userSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
export default User;
