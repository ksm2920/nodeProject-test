const User = require("../model/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transport = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: "fed20s@zohomail.eu",
        pass: "Tnal1029!!"
    }
})

const resetRender = (req,res) => {
   
    res.render("reset.ejs", {err:""})

}

const resetSubmit = async(req,res) => {
    const email = req.body.email

    const user = await User.findOne({email:email});

    if(!user) return res.redirect("/register");

    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;
    user.tokenExpiration = Date.now() + 3600000;

    await user.save();

    await transport.sendMail({
        from: "fed20s@zohomail.eu",
        to: user.email,
        subject: "Reset your password",
        html: `<h2> Click <a href = "http://localhost:8002/reset/${user.token}"> Here </a>to reset your password </h2>`

    })
    res.render("checkMail.ejs");
}

const resetParams = async( req, res) => {

    const token = req.params.token;

    try {
    const user = await User.findOne({token:token, tokenExpiration:{$gt: Date.now()} });

    if(!user) return res.redirect("/register");

    res.render("resetPasswordForm.ejs", {err:"", email:user.email});
    } 
    catch(err) {
        res.render("reset.ejs", {err:"Try again"});
    }

}

const resetFormSubmit = async(req, res) => {

    const newPassword = req.body.password;
    const email = req.body.email;

    const salt = await bcrypt.genSalt(12);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOne({email:email});
    user.password = newHashedPassword;
    await user.save(); 
    
    res.redirect("/login");

}


module.exports = { 
    resetRender, 
    resetSubmit,
    resetParams,
    resetFormSubmit
};
