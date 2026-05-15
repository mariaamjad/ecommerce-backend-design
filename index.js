const express = require("express");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.search = "";
  res.locals.category = "";

  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.locals.user = decoded;
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    res.locals.user = null;
  }
  // console.log(res.locals.user);

  next();
});

app.use("/", authRoutes);
app.use("/", productRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Connected Succesfully on port 3000.");
});
