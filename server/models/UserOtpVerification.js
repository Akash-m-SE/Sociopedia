import mongoose from 'mongoose';

const userOtpVerificationSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const VerifyOtp = mongoose.model('VerifyOtp', userOtpVerificationSchema);
export default VerifyOtp;
