const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loginRender = (req,res) => {
    
    res.render("login.ejs", {err:""})
}

const loginSubmit = async(req,res) => {
    
    const { name, password } = req.body;
    
    const user = await User.findOne({name:name});
    
    if(!user) return res.redirect("/register");
    
    const validUser = await bcrypt.compare(password, user.password);
    
    console.log(validUser);
    
    if(!validUser) return res.redirect("/login"); 
    
    const jwtToken = await jwt.sign({user:user}, process.env.SECRET_KEY)
    
    
    if(jwtToken) {
        
        const jwtTokenCookie = req.cookies.jwtToken
        
        if(!jwtTokenCookie) {
            
            res.cookie("jwtToken", jwtToken, {maxAge: 36000000, httpOnly: true})
            
        }
        
        return res.redirect("/");
    }
    
    return res.redirect("/login");
    
}

module.exports = { 
    loginRender, loginSubmit
}
