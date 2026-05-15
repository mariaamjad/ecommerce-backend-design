const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const User = require("../models/User");

// SignUp page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Signup 
router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;

    const existingUser = await User.findOne( {email} );
    if (existingUser) return res.send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.redirect('login')
});

// LOGIN
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne( {email} );
    if (!user) return res.send('Invalid Credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid Credentials");

    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token", token, { httpOnly: true });

    res.redirect('/products');
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.redirect("/");
});

module.exports = router;