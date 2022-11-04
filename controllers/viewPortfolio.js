const Portfolio = require("../models/Portfolio")
const {Converter} = require("easy-currencies")
const yahooFinance = require('yahoo-finance2').default;

exports.viewPortfolio = async (req,res) =>{
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
    var ownedList = portfolio.owned

    var ownedJSON =  []


    await Promise.all(ownedList.map(async (i) => {
        const quote = await yahooFinance.quote(i.symbol);

        const converter = new Converter();
        const multiplier = await converter.convert(1,quote.currency, "INR");
        
        tempObj = {}

        
        tempObj.name = quote.shortName,
        tempObj.quantity = i.quantity,
        tempObj.ltp = (quote.regularMarketPrice * multiplier)
        tempObj.change = (quote.regularMarketChange * multiplier)
        tempObj.changePercent = quote.regularMarketChangePercent
        tempObj.symbol = i.symbol
        tempObj.currency = quote.currency 

        // console.log(tempObj)

        ownedJSON.push({name  : tempObj.name,
            quantity : tempObj.quantity,
            ltp : tempObj.ltp,
            change : tempObj.change,
            changePercent : tempObj.changePercent,
            symbol : tempObj.symbol,
            currency : tempObj.currency})
    }));
      

    console.log(ownedJSON)
    return res.status(200).send(ownedJSON)

}