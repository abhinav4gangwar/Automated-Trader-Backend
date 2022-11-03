const jwt = require('jsonwebtoken')


const jwtSecret = process.env.JWTSECRET

exports.stockChart = async(req, res, next) => {
    res.send("hello")
}