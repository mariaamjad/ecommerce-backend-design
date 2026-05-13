const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Home Page
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(10);

    res.render("index", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Product Listing Page
router.get("/products", async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;

    const page = parseInt(req.query.page) || 1;
    const view = req.query.view || "list";

    let limit = view === "grid" ? 9 : 6;
    let skip = (page - 1) * limit;

    // const sort = req.query.sort || "all";

    let filter = {};

    if (category) {
      filter.category = category;
    }

    // if (sort === "featured") {
    //   filter.featured = true;
    // }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts/limit);

    res.render("products", {
      products,
      search,
      category,
      page,
      view,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Product Details Page
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("detail", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Cart
router.get("/cart", (req, res) => {
  res.render("cart");
});

module.exports = router;
