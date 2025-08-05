const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

dotenv.config();

const app = express();

//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }).catch((err) => {
            console.log("DB Connection Error: ", err);
    });