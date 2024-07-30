const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const bodyparser = require("body-parser");
const multer = require("multer");
const connectDB = require("./server/database/connect");
// const adminRouter = require("./server/routes/adminRouter");
const app = express();

// Middleware

dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(express.json()); // Parse incoming requests data (JSON)
app.use(cors());

app.use(morgan("tiny"));
// app.use("/auth",adminRouter); // Routes for /api/v1/auth go here

// Check code
app.use(bodyparser.json({ limit: '1mb' }));
app.use(bodyparser.urlencoded({ extended: true, limit: '1mb' }));



// MongoDB connection

connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// Define the storage strategy for file uploads
const storage = multer.memoryStorage();

/** these are public calls which do not need authorization */
app.use("/public", require("./server/routes/signupRoutes"));
app.use("/category", require("./server/routes/categoryRouter"));
app.use("/products", require("./server/routes/productRouter"));
app.use("/booking", require("./server/routes/bookingRouter"));
app.use("/billing", require("./server/routes/billingRouter"));
app.use("/main", require("./server/routes/rolesRoute"));

// Customer
// app.use('/customer',require('./server/routes/customerRoutes'));

// App running Port
app.listen(PORT, () => {
  console.log(`App is running on PORT http://localhost:${PORT}`);
});
