
const Portfolio = require("../models/Portfolio")

exports.addFav = async(req, res, next) => {
    const {username, symbol} = req.body
    console.log(symbol)
    
    if (!username) {
        return res.status(401).json({
            message: "not logged in",
        })
    }
    const portfolio = await Portfolio.findOne({user :  username})

    if (!portfolio){
        return res.status(404).json({
            message: "error occured, not found",
        })
    }
    var favList = portfolio.fav
    console.log(favList)



    // console.log(!favList.includes(symbol))
    
    if (favList.includes(symbol)){
        return res.status(200).send({message : `${symbol} already in favourites`})
    }

    favList.push(symbol)
    portfolio.fav = favList
    portfolio.save(function(err) {
        if(!err) {
            return res.status(200).send({message : `${symbol} added successfully`})
        }
        else {
            return res.status(502).send({message : "not added successfully"})
        }
    })
}