const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js"); 
const cors = require("cors");
const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback.js");

dotenv.config();

const app = express();


app.use(cors()); 
app.use(express.json());


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
