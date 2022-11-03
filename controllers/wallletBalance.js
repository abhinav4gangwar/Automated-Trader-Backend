
const User = require("../models/User")
const Portfolio = require("../models/Portfolio")
const Mongoose = require("mongoose")

exports.walletBalance = async(req, res, next) => {
    const {username} = req.body
    
    if (!username) {
        return res.status(400).json({
            message: "not logged in",
        })
    }
    const user = await User.findOne({ username })
    if (!user) {
        res.status(400).json({
            message: "user not found",
        })
        }

    const portfolio = await Portfolio.findOne({user :  username})

    if (!portfolio){
        return res.status(404).json({
            message: "error occured, not found",
        })
    }

    var obj = {fName : user.fName,
               lName : user.lName,
               balance : portfolio.balance}

    res.status(200).send(obj)
}