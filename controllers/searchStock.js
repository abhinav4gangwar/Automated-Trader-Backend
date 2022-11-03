
const yahooFinance = require('yahoo-finance2').default;

exports.searchStock = async(req, res, next) => {
    const {symbol} = req.body

    console.log(symbol)
    const today = new Date()

    const day = today.getDate()        
    const month = today.getMonth()     
    const year = today.getFullYear() 
    // console.log(`${year}-${month+1}-${day}`)

    const queryOptions = { period1: `${year-1}-${month+1}-${day}`, period2 : `${year}-${month+1}-${day}`};
    const result = await yahooFinance.historical(symbol.trim(), queryOptions);

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(result)
}