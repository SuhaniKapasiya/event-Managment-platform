const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");


const app = express();

app.use(express.json());
app.use(cookieParser());



app.use("/", authRoutes);
app.use("/",eventRoutes)

connectDB()
  .then(() => {
    console.log("DB Connected Successfully");
    app.listen(5000, () => {
      console.log("Server is successfully listening on port 5000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });






// wild card error handling

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
