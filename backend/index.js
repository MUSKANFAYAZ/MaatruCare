const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// --- CONFIGURATION ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Security Headers (COOP/COEP)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// --- PROXY ROUTES (Chatbot & Reports) ---

// Chatbot proxy -> port 8000
app.post('/api/chat', async (req, res) => {
  try {
    const pyRes = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await pyRes.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Chatbot Error:', err.message);
    res.status(503).json({ error: 'Chatbot service unavailable' });
  }
});

// Mood report proxy -> port 8002  
app.get('/report/:userId', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8002/report/${req.params.userId}`);
    
    if (!response.ok) {
        throw new Error(`Report service responded with ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="maatru-report-${req.params.userId}.pdf"`
    });
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('❌ Report Error:', error.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// --- API ROUTES ---
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
const journalRoutes = require("./routes/journal");
const happyMomentRoutes = require("./routes/happymoment");
const appointmentRoutes = require('./routes/appointments'); // Fixed spacing here
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/happymoments", happyMomentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('MaatruCare Backend is running...');
});

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

// --- START SERVER ---
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
});