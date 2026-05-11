const express = require("express");
// helps working with files and directories
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const app = express();

connectDB();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.render("gridview", {
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }

  // res.sendFile(path.join(__dirname, 'public', 'gridview.html'));
});

app.get("/products/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detail.html"));
});

app.listen(3000, () => {
  console.log("Connected Succesfully on port 3000.");
});
