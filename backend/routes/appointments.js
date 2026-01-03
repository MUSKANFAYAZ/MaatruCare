const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/DoctorProfile');
const User = require('../models/User');
const twilio = require('twilio');
const Notification = require('../models/Notification');
const mongoose = require('mongoose'); // <--- 1. ADDED THIS IMPORT

// Initialize Twilio Client
// (Only initializing if env vars exist to prevent startup crashes)
const client = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// @route   POST api/appointments/book
// @desc    Book appointment & Notify Doctor (DB + Twilio)
// @route   POST api/appointments/book
// @route   POST api/appointments/book
router.post('/book', auth, async (req, res) => {
  console.log("------------------------------------------");
  console.log("🔔 HIT: /api/appointments/book");
  console.log("📥 Payload Doctor ID:", req.body.doctorId);

  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id; // From the token

    // --- HELPER: SAVE NOTIFICATION ---
    const saveNotification = async (userId, msg) => {
        try {
            const notif = new Notification({
                user: userId,
                message: msg,
                type: 'success'
            });
            await notif.save();
            console.log(`✅ Notification SAVED to User ID: ${userId}`);
        } catch (e) {
            console.error("❌ Notification Save Failed:", e.message);
        }
    };

    // --- CHECK 1: IS IT A VALID MONGODB ID? ---
    // If NOT valid (e.g. "static-id"), we treat it as a simulation.
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        console.log("⚠️ Invalid/Static ID detected. Entering Simulation Mode.");
        
        // FORCE SAVE notification to Patient (You)
        await saveNotification(patientId, `(Simulation) Appointment booked with Dr. Muskan on ${date} at ${time}.`);
        
        return res.json({ msg: "Static booking successful (Notification Saved)" });
    }

    // --- CHECK 2: DOES DOCTOR EXIST IN DB? ---
    const doctorProfile = await Doctor.findById(doctorId);
    
    // IF DOCTOR NOT FOUND -> Treat as simulation instead of error
    if (!doctorProfile) {
        console.log("⚠️ Doctor ID is valid format, but NOT found in DB. Simulating success.");
        
        // FORCE SAVE notification to Patient (You)
        await saveNotification(patientId, `(Simulation) Appointment booked with unknown doctor on ${date} at ${time}.`);
        
        return res.json({ msg: "Doctor not found, but notification saved for demo." });
    }

    // --- CHECK 3: REAL BOOKING (Happy Path) ---
    console.log("✅ Real Doctor Found:", doctorProfile._id);

    // Get Patient Name
    const user = await User.findById(patientId).select('-password');
    const patientName = user ? (user.name || "MaatruCare User") : "Guest";

    // Save Appointment
    const newAppointment = new Appointment({
      doctor: doctorId,
      patientName,
      patientPhone: user.phone || "Not Provided",
      date,
      time
    });
    await newAppointment.save();
    console.log("✅ Appointment Saved to DB");

    // NOTIFY DOCTOR (If they have a user account)
    if (doctorProfile.user) {
        await saveNotification(doctorProfile.user, `New Appointment: ${patientName} on ${date} at ${time}.`);
    }

    // NOTIFY PATIENT (Also notify you, just in case!)
    await saveNotification(patientId, `Appointment confirmed with Dr. ${doctorProfile.personalInfo?.name || 'Muskan'} on ${date} at ${time}.`);

    res.json(newAppointment);

  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;


// @route   GET api/appointments/doctor
// @desc    Get all appointments for the logged-in doctor
router.get('/doctor', auth, async (req, res) => {
  try {
    // Find the doctor profile associated with this user
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) return res.status(404).json({ msg: 'Doctor profile not found' });

    // Find appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctorProfile._id }).sort({ date: 1 });
    res.json(appointments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;