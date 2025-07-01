const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },

  // ✅ XP and Streak fields
  xp: { type: Number, default: 0 },
  streak: {
    count: { type: Number, default: 0 },
    lastStudyDate: { type: Date }
  }
}, { timestamps: true });

// ✅ Virtual field for level
userSchema.virtual('level').get(function () {
  return Math.floor(this.xp / 100) + 1;
});

// Make virtuals appear in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
