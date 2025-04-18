// models/Otp.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "24h" }, // Optional TTL (auto-delete after 24 hours)
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Add metadata if needed
  generatedBy: {
    type: String,
    default: "system",
  },
  usedBy: {
    type: String,
    default: null,
  },
});

// Pre-save hook to format code
otpSchema.pre("save", function (next) {
  if (this.isModified("code")) {
    this.code = this.code.toUpperCase().replace(/\s/g, "");
  }
  next();
});

// Static method to generate a new OTP
otpSchema.statics.generateOTP = async function (length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding confusing characters
  let code;
  let exists;

  // Ensure unique code
  do {
    code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    exists = await this.findOne({ code });
  } while (exists);

  return code;
};

module.exports = mongoose.model("OTP", otpSchema);
