// controllers/otpController.js
const OTP = require("../models/Otp");

// Generate a new OTP
exports.generateOTP = async (req, res) => {
  try {
    const code = await OTP.generateOTP();
    const otp = new OTP({ code });
    await otp.save();

    res.status(201).json({
      success: true,
      data: {
        id: otp._id,
        code: otp.code,
        createdAt: otp.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + err.message,
    });
  }
};

// Validate an OTP
exports.validateOTP = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "OTP code is required",
      });
    }

    const otp = await OTP.findOne({ code });

    if (!otp) {
      return res.status(404).json({
        success: false,
        error: "Invalid OTP code",
      });
    }

    if (otp.isUsed) {
      return res.status(400).json({
        success: false,
        error: "OTP has already been used",
      });
    }

    // Mark as used
    otp.isUsed = true;
    otp.usedAt = new Date();
    otp.usedBy = req.ip; // Or user ID if authenticated
    await otp.save();

    res.json({
      success: true,
      data: {
        id: otp._id,
        isValid: true,
        message: "OTP validated successfully",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + err.message,
    });
  }
};

// List all OTPs (with pagination)
exports.listOTPs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const otps = await OTP.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await OTP.countDocuments();

    res.json({
      success: true,
      data: otps,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + err.message,
    });
  }
};

// Delete an OTP
exports.deleteOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const otp = await OTP.findByIdAndDelete(id);

    if (!otp) {
      return res.status(404).json({
        success: false,
        error: "OTP not found",
      });
    }

    res.json({
      success: true,
      data: {
        message: "OTP deleted successfully",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + err.message,
    });
  }
};
