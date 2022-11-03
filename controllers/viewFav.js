const Portfolio = require("../models/Portfolio")
const yahooFinance = require('yahoo-finance2').default;

exports.viewFav = async (req,res) =>{
    const {username} = req.body
    
    if (!username) {
        return res.status(400).json({
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

    var favJSON =  []


    await Promise.all(favList.map(async (i) => {
        
        tempObj = {}

        const quote = await yahooFinance.quote(i);
        
        tempObj.name = quote.shortName
        tempObj.ltp = quote.regularMarketPrice
        tempObj.change = quote.regularMarketChange
        tempObj.changePercent = quote.regularMarketChangePercent
        tempObj.symbol = i
        tempObj.currency = quote.currency 

        console.log(tempObj)

        favJSON.push({name  : tempObj.name,
            ltp : tempObj.ltp,
            change : tempObj.change,
            changePercent : tempObj.changePercent,
            symbol : tempObj.symbol,
            currency : tempObj.currency})
    }));
      

    console.log(favJSON)
    return res.status(200).send(favJSON)

}