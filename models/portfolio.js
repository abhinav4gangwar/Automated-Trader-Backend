
const Mongoose = require("mongoose")
const PortfolioSchema = new Mongoose.Schema({

    balance: {
        type: Number,
        default : 100000
    },
    pl: {
        type: Number,
        default : 0
    },
    user: {
        type: String,
        required: true
    },
    fav: {
        type: Array,
        default : []
    },
    owned: {
        type: Array,
        default : []
    },
    transactions: {
        type: Array,
        default : []
    },
    })
    
const Portfolio = Mongoose.model("portfolio", PortfolioSchema)
module.exports = Portfolio