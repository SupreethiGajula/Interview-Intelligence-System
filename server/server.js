require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const candidateRoutes = require("./routes/candidateRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/candidates", candidateRoutes);
app.use("/roleweights",roleRoutes);
app.use("/auth",authRoutes)

// Test route
app.get('/', (req, res) => {
  res.status(200).send("EXPRESS ROOT OK");
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});

app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
