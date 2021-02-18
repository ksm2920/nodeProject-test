const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyInstructor = (req, res, next) => {
    
    const token = req.cookies.jwtToken;
    
    if(!token) return res.render("login.ejs", {err:"You must log in!"})
    
    const validUser = jwt.verify(token, process.env.SECRET_KEY)
    

    console.log(validUser.user.role);

    if(!validUser.user.role) return res.render("login.ejs", {err:"You have not authorization to do this"})
        
    req.user = validUser;
  
    next();
}

module.exports = verifyInstructor;