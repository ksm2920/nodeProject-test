const Course = require("../model/course");
const User = require("../model/user");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const addCourseForm = (req, res) => {
    
    res.render("courseForm.ejs", {err:""})
    
}

const addcourseFormSubmit = async(req, res) => {
    const {name, description, price} = req.body;
    const course = await new Course ({name:name, description: description, price: price}).save();
    
    const user = await User.findOne({_id:req.user.user._id})
    
    user.addCourseList(course._id);
    console.log(user);
    res.redirect("/showCourses");
}

const showInstructorCourses = async (req, res) => {
    
    const user = await User.findOne({_id:req.user.user._id}).populate("courseList");
    
    console.log(user.courseList)
    
    res.render("instructorPage.ejs", { courses: user.courseList, err:""})
    
}

const showCourses = async(req, res) => {
    const courses = await Course.find();
    
    res.render("showCourse.ejs", {err:"", courses:courses});
    
}

const addToShoppingCart = async(req,res) => {
    
    const courseId = req.params.id;
    
    const user = await User.findOne({_id: req.user.user._id})
    
    user.addToCart(courseId);
    //    console.log(user);
    
    const userWithCourseData = await User.findOne({_id:req.user.user._id}).populate("shoppingCart");
    console.log(userWithCourseData.shoppingCart);
    
    res.render("shoppingCart.ejs", {cartItem:userWithCourseData.shoppingCart, err:""});
    
    
}

const checkout = async(req, res) => {
    const user = await User.findOne({_id: req.user.user._id}).populate("shoppingCart");
    console.log(user.shoppingCart); 
    
    if(!user.shoppingCart || user.shoppingCart.length === 0 ) return res.redirect("/showCourses");     
    const session = await stripe.checkout.sessions.create({
        success_url: 'https://localhost:8002/shoppingSuccess',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: user.shoppingCart.map(course => {

            return {
                name: course.name,
                amount: course.price,
                quantity: 1,
                currency: "sek"
            }
        }) ,
        mode: 'payment',
    })
    res.render("checkout.ejs", {cartItem: user.shoppingCart, sessionId: session.id});
    
}

const shoppingSuccess = async(req, res) => {

    const user = await User.findOne({_id:req.user.user._id})
    
    user.shoppingCart = [];
    user.save();

    res.send("Your cart is empty. We will send your product within 3days.")

}

module.exports = {
    addCourseForm,
    addcourseFormSubmit,
    showCourses,
    addToShoppingCart,
    showInstructorCourses,
    checkout,
    shoppingSuccess
}