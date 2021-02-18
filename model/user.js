const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: String,
    token: String,
    tokenExpiration: Date,
    shoppingCart:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "course"
        }
    ],
    courseList: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "course"
    }
]

})

userSchema.methods.addToCart = function(courseId) {
    
    this.shoppingCart.push(courseId);

    this.save();

}

userSchema.methods.addCourseList = function(courseId) {

    this.courseList.push(courseId);
    this.save();

}

const User = mongoose.model("user", userSchema);

module.exports = User;