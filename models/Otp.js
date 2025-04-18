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
    index: { expires: "24h" },
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
  generatedBy: {
    type: String,
    default: "system",
  },
  usedBy: {
    type: String,
    default: null,
  },
});

otpSchema.pre("save", function (next) {
  if (this.isModified("code")) {
    this.code = this.code.toUpperCase().replace(/\s/g, "");
  }
  next();
});

otpSchema.statics.generateOTP = async function (length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code;
  let exists;

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
