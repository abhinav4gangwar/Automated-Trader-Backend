const express = require("express")
const router = express.Router()

const { stockChart } = require("../controllers/stock")
const { searchStock } = require("../controllers/searchStock")
const { walletBalance } = require("../controllers/wallletBalance")
const { addFav } = require("../controllers/addFav")
const { viewFav } = require("../controllers/viewFav")
const { buyStock, sellStock } = require("../controllers/buySell")
const { transactions } = require("../controllers/transactions")
const { viewPortfolio } = require("../controllers/viewPortfolio")

router.route("/stock-chart").get(stockChart)
router.route("/search-stock").post(searchStock)
router.route("/wallet-balance").post(walletBalance)
router.route("/add-fav").post(addFav)
router.route("/view-fav").post(viewFav)
router.route("/view-portfolio").post(viewPortfolio)
router.route("/buy-stock").post(buyStock)
router.route("/sell-stock").post(sellStock)
router.route("/get-transactions").post(transactions)



module.exports = router