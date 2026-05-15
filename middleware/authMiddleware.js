const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.redirect('/login');
    }
    // console.log(req.user);
}


function adminMiddleware(req, res, next) {
    if (!req.user.isAdmin){
        return res.status(403).send("Access denied");
    }
    // console.log(req.user);
    next();
}

module.exports = { authMiddleware, adminMiddleware };