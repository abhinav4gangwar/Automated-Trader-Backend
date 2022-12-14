const Portfolio = require("../models/Portfolio")
const {Converter} = require("easy-currencies")
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
        const quote = await yahooFinance.quote(i);

        const converter = new Converter();
        const multiplier = await converter.convert(1,quote.currency, "INR");
        
        tempObj = {}

        
        tempObj.name = quote.shortName
        tempObj.ltp = (quote.regularMarketPrice * multiplier)
        tempObj.change = (quote.regularMarketChange * multiplier)
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