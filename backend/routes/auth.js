const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');


// Register
router.post('/register', async (req, res) => {
const { name, email, password, role } = req.body;
if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email in use' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash, role: role || 'patient' });
// If doctor, set isDoctorApproved=false by default
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});


// Login
router.post('/login', async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

 // Admin static login
 const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
 const adminPass = (process.env.ADMIN_PASSWORD || '').trim();
 const reqEmail = String(email).trim().toLowerCase();
 const reqPass = String(password).trim();
 const staticEmail = 'admin@hms.local';
 const staticPass = 'admin123';
 const isEnvAdmin = adminEmail && adminPass && reqEmail === adminEmail && reqPass === adminPass;
 const isStaticAdmin = reqEmail === staticEmail && reqPass === staticPass;
 if (isEnvAdmin || isStaticAdmin) {
  const loginEmail = isEnvAdmin ? process.env.ADMIN_EMAIL : staticEmail;
  const loginPass = isEnvAdmin ? process.env.ADMIN_PASSWORD : staticPass;
  let admin = await User.findOne({ email: loginEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash(loginPass, 10);
    admin = await User.create({ name: 'Administrator', email: loginEmail, passwordHash, role: 'admin' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  return res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
 }
const emailRegex = new RegExp('^' + reqEmail.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '$', 'i');
const user = await User.findOne({ email: emailRegex });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
// if doctor login must be approved
if (user.role === 'doctor' && !user.isDoctorApproved) return res.status(403).json({ message: 'Doctor not approved yet' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});


// Forgot password - send OTP
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const emailLower = String(email).trim().toLowerCase();
  const emailRegex = new RegExp('^' + emailLower.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '$', 'i');
  const user = await User.findOne({ email: emailRegex });
  if (!user) return res.json({ ok: true });
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  try {
    const body = `Your password reset OTP is ${otp}.\nThis OTP expires in 10 minutes.`;
    await sendMail(user.email, 'Password Reset OTP', body);
  } catch (e) {}
  res.json({ ok: true });
});

// Reset password with OTP
router.post('/reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword || String(newPassword).trim().length < 6) {
    return res.status(400).json({ message: 'Email, otp, newPassword (min 6 chars) required' });
  }
  const emailLower = String(email).trim().toLowerCase();
  const emailRegex = new RegExp('^' + emailLower.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '$', 'i');
  const user = await User.findOne({ email: emailRegex });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.resetOtp || !user.resetOtpExpires || String(user.resetOtp).trim() !== String(otp).trim()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  if (Date.now() > new Date(user.resetOtpExpires).getTime()) {
    return res.status(400).json({ message: 'OTP expired' });
  }
  const bcrypt = require('bcrypt');
  user.passwordHash = await bcrypt.hash(String(newPassword).trim(), 10);
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();
  res.json({ ok: true, role: user.role });
});

module.exports = router;