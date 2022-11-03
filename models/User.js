// user.js
const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({

    fName: {
        type: String,
        unique: false,
        required: true,
    },
    lName: {
        type: String,
        unique: false,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    }
})

const User = Mongoose.model("user", UserSchema)
module.exports = User