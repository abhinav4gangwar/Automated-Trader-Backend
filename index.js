const express = require("express")
app = express()

require('dotenv').config();
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
app.use(cookieParser())
const path = require('path')
const cors=require("cors");
const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))

const jwt_decode = require("jwt-decode")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { adminAuth, userAuth } = require('./middleware/auth')


const connectDB = (url) => {
    return mongoose.connect(url)
}

app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"))
app.use("/api/stock", require("./routes/stock"))
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));


app.get("/",userAuth, (req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.json({loggedIn : true, user : req.user})
})


const port = process.env.PORT || 3001
const start = async() => {
    await connectDB(process.env.URI)
    app.listen(port, () => {
        console.log(`server is listening on port ${port}`)
    })
}


start()