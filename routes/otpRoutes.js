// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");

// Generate a new OTP
router.post("/generate", otpController.generateOTP);

// Validate an OTP
router.post("/validate", otpController.validateOTP);

// List OTPs
router.get("/", otpController.listOTPs);

// Delete OTP
router.delete("/:id", otpController.deleteOTP);

module.exports = router;
