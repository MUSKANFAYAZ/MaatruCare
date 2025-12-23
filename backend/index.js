const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected Successfully');
  } catch (error) {
    console.error(' MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

connectDB();

const authRoutes = require('./routes/auth'); 

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('IVPOI Backend is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const journalRoutes = require("./routes/journal");
app.use("/api/journals", journalRoutes);

const happyMomentRoutes = require("./routes/happymoment");
app.use("/api/happymoments", happyMomentRoutes);


