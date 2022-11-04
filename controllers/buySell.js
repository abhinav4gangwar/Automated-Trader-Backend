const {Converter} = require("easy-currencies")
const Portfolio = require("../models/Portfolio")

exports.buyStock = async(req, res, next) => {
    const orderObj = req.body
    // console.log(parseInt(orderObj.quantity))

    const converter = new Converter();
    const multiplier = await converter.convert(1,orderObj.currency, "INR");

    var order = {}
    order.type = orderObj.type
    order.symbol = orderObj.symbol
    order.name = orderObj.name
    order.stock_date = orderObj.date
    order.order_date = new Date().toLocaleString();
    order.quantity = parseInt(orderObj.quantity)
    order.price_original = parseFloat(orderObj.price.toFixed(2))
    order.price_INR = parseFloat((parseFloat(orderObj.price) * multiplier).toFixed(2))
    order.final_price = parseFloat((parseFloat(orderObj.price) * multiplier * orderObj.quantity).toFixed(2))
    
    console.log(order); // converted value
    res.setHeader("Access-Control-Allow-Origin", "*")

    if (!orderObj.username) {
        return res.status(401).json({
            message: "not logged in",
        })
    }
    const portfolio = await Portfolio.findOne({user :  orderObj.username})

    if (!portfolio){
        return res.status(404).json({
            message: "error occured, not found",
        })
    }
    var transactionsList = portfolio.transactions
    var ownedList = portfolio.owned


    var walletBalance = portfolio.balance

    if (order.final_price > walletBalance){
        return res.status(502).send({message : "order not placed, low balance"})
    }

    

    var ownedStock = {symbol : order.symbol,
                      quantity : order.quantity,
                      price : order.final_price}


    console.log(ownedList)

    var newArray = []

    if (ownedList){
        for (let i=0; i<ownedList.length; i++){
            
            if (ownedList[i].symbol === order.symbol){

                var temp ={}
                temp.symbol = order.symbol
                temp.quantity =ownedList[i].quantity + order.quantity
                temp.price = ownedList[i].price + order.final_price

                newArray.push(temp)

                break
            }
            else{
                newArray.push(ownedList[i])
            }
        }
    }

    console.log(ownedList)
    
    
    
    if (!(ownedList.find(item => {
        return item.symbol === order.symbol
    }))){
        newArray = ownedList
        newArray.push(ownedStock)
    }


    transactionsList.push(order)
    walletBalance = (walletBalance - order.final_price.toFixed(2)).toFixed(2)

    portfolio.transactions = transactionsList
    // portfolio.transactions = []
    portfolio.balance = walletBalance
    // portfolio.balance = 1000000
    portfolio.owned = []
    portfolio.owned = newArray

    console.log(portfolio.owned)

    portfolio.save(function(err) {
    
        if(!err) {
            console.log(true)
            return res.status(200).send({message : `${order.name} order successfully placed`})
        }
        else {
            
            return res.status(502).send({message : "order not placed"})
        }
    })

    
}
exports.sellStock = async(req, res, next) => {
    const orderObj = req.body
    console.log(orderObj)

    const converter = new Converter();
    const multiplier = await converter.convert(1,orderObj.currency, "INR");

    var order = {}
    order.type = orderObj.type
    order.symbol = orderObj.symbol
    order.name = orderObj.name
    order.stock_date = orderObj.date
    order.order_date = new Date().toLocaleString();
    order.quantity = parseInt(orderObj.quantity)
    order.price_original = parseFloat(orderObj.price.toFixed(2))
    order.price_INR = parseFloat((parseFloat(orderObj.price) * multiplier).toFixed(2))
    order.final_price = parseFloat((parseFloat(orderObj.price) * multiplier * orderObj.quantity).toFixed(2))
    
    console.log(order);
    res.setHeader("Access-Control-Allow-Origin", "*")

    if (!orderObj.username) {
        return res.status(401).json({
            message: "not logged in",
        })
    }
    const portfolio = await Portfolio.findOne({user :  orderObj.username})

    if (!portfolio){
        return res.status(404).json({
            message: "error occured, not found",
        })
    }
    var transactionsList = portfolio.transactions
    var ownedList = portfolio.owned

    var walletBalance = portfolio.balance

    if (!(ownedList.find(item => {
        return item.symbol === order.symbol}))){
        return res.status(502).send({message : "order not completed, you dont own the stock"})
    }

    if ((ownedList.find(item => {
        return item.symbol === order.symbol})).quantity < order.quantity){
        return res.status(502).send({message : "order not completed, you dont own the suffecient quantity"})
    }



    var newArray = []

    if (ownedList){
        for (let i=0; i<ownedList.length; i++){
            
            if (ownedList[i].symbol === order.symbol){

                var temp ={}
                temp.symbol = order.symbol
                temp.quantity =ownedList[i].quantity - order.quantity
                temp.price = ownedList[i].price - order.final_price

                newArray.push(temp)

                break
            }
            else{
                newArray.push(ownedList[i])
            }
        }
    }

    console.log(ownedList)


    transactionsList.push(order)
    walletBalance = (walletBalance + order.final_price.toFixed(2)).toFixed(2)

    portfolio.transactions = transactionsList
    // portfolio.transactions = []
    portfolio.balance = walletBalance
    // portfolio.balance = 1000000
    portfolio.owned = []
    portfolio.owned = newArray

    console.log(portfolio.owned)

    portfolio.save(function(err) {
    
        if(!err) {
            console.log(true)
            return res.status(200).send({message : `${order.name} order successfully placed`})
        }
        else {
            
            return res.status(502).send({message : "order not placed"})
        }
    })

    
}