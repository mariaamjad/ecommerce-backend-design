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
      success: req.query.success,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Add Product Page
router.get('/products/add', (req, res) => {
  res.render('add-product', { errors: [] });
});

// Handle Add Product Form Submission
router.post("/products/add", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      image,
      description,
      stock,
      rating,
      reviews,
      featured,
    } = req.body;

    const errors = [];

    if (!name || name.trim().length < 3) {
      errors.push("Name must be at least 3 characters long");
    }

    if (!category) {
      errors.push("Category is required");
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      errors.push("Price must be a valid number greater than 0");
    }

    if (!image || image.trim().length < 5) {
      errors.push("Image URL is required");
    }

    if (!description || description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    // OPTIONAL FIELDS
    if (oldPrice && (isNaN(Number(oldPrice)) || Number(oldPrice) < 0)) {
      errors.push("Old price must be 0 or greater");
    }

    if (stock && (isNaN(Number(stock)) || Number(stock) < 0)) {
      errors.push("Stock cannot be negative");
    }

    if (rating && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
      errors.push("Rating must be between 0 and 5");
    }

    if (reviews && (isNaN(Number(reviews)) || Number(reviews) < 0)) {
      errors.push("Reviews cannot be negative");
    }

    if (errors.length > 0) {
      // console.log("ERRORS:", errors);
      return res.status(400).render("add-product", {errors, });
    }

    const product = new Product({
      name,
      category,
      price,
       oldPrice,
      image,
      description,
      stock,
      rating,
      reviews,
      featured: featured === "on", 
    });

    await product.save();

    res.redirect('/products?success=Product added successfully');
  }
  catch (error) {
    console.log(error);
    res.send("Error creating product");
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
