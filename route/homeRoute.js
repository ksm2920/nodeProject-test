const express = require("express");

const router = express.Router();

const verifyUser = require("../middleware/verifyUser");
const verifyInstructor = require("../middleware/verifyInstructor");
const {homeRender, homeInstructor} = require("../controller/homeController");


router.get("/",verifyUser, homeRender);

router.get("/logout", (req, res) => {

    res.clearCookie("jwtToken").redirect("/login");

})

router.get("/instructor", verifyInstructor, homeInstructor);

module.exports = router;