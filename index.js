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

app.get("/", async(req, res) => {
  try {
    const products = await Product.find({featured: true}).limit(10);

    res.render("index", {products,});
  }
  catch (error){
    console.log(error);
    res.status(500).send('Server Error');
  }

});

app.get("/products", async (req, res) => {
  try {
    const category = req.query.category;

    let products;

    if (category) {
      products = await Product.find({category: category});
    }
    else{
      products = await Product.find();
    }

    res.render("products", {
      products,
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// app.get(["/listview", "/gridview"], (req, res) => {
//   res.redirect("/products");
// });


app.get("/products/:id", async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);

    res.render("detail", {product,});
  }
  catch(error) {
    res.status(500).send('Server Error');
  }

  // res.sendFile(path.join(__dirname, "public", "detail.html"));
});


app.get("/cart", (req, res) => {
  res.render("cart");
});

app.listen(3000, () => {
  console.log("Connected Succesfully on port 3000.");
});
