const Portfolio = require("../models/Portfolio")


exports.transactions = async (req,res) =>{
    const {username} = req.body
    
    if (!username) {
        return res.status(400).json({
            message: "not logged in",
        })
    }
    const portfolio = await Portfolio.findOne({user :  username}).sort({ iso_date: -1 })

    if (!portfolio){
        return res.status(404).json({
            message: "error occured, not found",
        })
    }

    return res.status(200).send(portfolio.transactions)

}