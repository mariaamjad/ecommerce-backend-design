const express = require("express");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");

const app = express();

connectDB();

app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.search = "";
  res.locals.category = "";
  next();
});

app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Connected Succesfully on port 3000.");
});
