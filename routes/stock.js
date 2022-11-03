const express = require("express")
const router = express.Router()

const { stockChart } = require("../controllers/stock")
const { searchStock } = require("../controllers/searchStock")
const { walletBalance } = require("../controllers/wallletBalance")
const { addFav } = require("../controllers/addFav")
const { viewFav } = require("../controllers/viewFav")

router.route("/stock-chart").get(stockChart)
router.route("/search-stock").post(searchStock)
router.route("/wallet-balance").post(walletBalance)
router.route("/add-fav").post(addFav)
router.route("/view-fav").post(viewFav)




module.exports = router