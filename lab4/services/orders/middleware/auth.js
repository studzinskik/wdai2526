const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

function requireAuth(req, res, next){
    const auth = req.headers.authorization;

    if(!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({error: "No token"});
    }

    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch(e) {
        return res.status(401).json({error: "Invalid token"});
    }
}

module.exports = { requireAuth };