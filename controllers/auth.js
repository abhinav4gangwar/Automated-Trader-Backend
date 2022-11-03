const User = require("../models/User")
const Portfolio = require("../models/Portfolio")



const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')


const jwtSecret = process.env.JWTSECRET

exports.registerUser = async(req, res, next) => {
    console.log(req.body)
    const { username, password, fName, lName, email } = req.body
    if (password.length < 6) {
        res.setHeader("Access-Control-Allow-Origin", "*")
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async(hash) => {
        await User.create({
                fName,
                lName,
                email,
                username,
                password: hash,
            })
            .then((user) => {

                Portfolio.create({
                    user : user.username
                })

                const maxAge = 3 * 60 * 60;
                const token = jwt.sign({ id: user._id, username, role: user.role },
                    jwtSecret, {
                        expiresIn: maxAge, // 3hrs in sec
                    }
                );
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                });
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.status(201).json({
                    message: "User successfully created",
                    user: user._id,
                });
            })
            .catch((error) =>
{            res.setHeader("Access-Control-Allow-Origin", "*")
                res.status(400).json({
                    message: "User not created  - username already taken",
                    error: error.message,
                })}
            );
    });
};

exports.loginUser = async(req, res, next) => {
    
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {

            bcrypt.compare(password, user.password).then(async function(result) {
                if (result) {
                    const maxAge = 84000;
                    const token = jwt.sign({ id: user._id, username, role: user.role },
                        jwtSecret, {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    // res.cookie("jwt", token, {
                    //     httpOnly: false,
                    //     maxAge: maxAge * 1000, // 3hrs in ms
                    // });
                    // res.render("home", { user });
                    // res.status(200).redirect("/")
                    res.status(200).json({ message: "Login succesful",
                                            // username : user.username,
                                            // role : user.role,
                                            token : token ,
                                            username : user.username});
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        }

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
             error: error.message,
        });
    }
};

exports.getUser = async (req, res, next) =>{
    const {username } = req.body

    if (!username){
        res.status(404).json({message : "no username"})
    }
    const user = await User.findOne({username: username})
    if (!user) res.status(404).json({message : "username not found"})

    res.status(200).json({username : user.username,
                        fName : user.fName,
                        lName : user.lName,
                        email : user.email})


}

// exports.updateUser = async(req, res, next) => {
   
//     const { username, } = req.body;
//     if (username) {
        
//             await User.findOne({username : username})
//                 .then((user) => {
//                     if (user.role !== "admin") {
//                         user.role = role;
//                         user.save((err) => {
//                             if (err) {
//                                 res
//                                     .status("400")
//                                     .json({ message: "An error occurred", error: err.message });
//                                 process.exit(1);
//                             }
//                             res.status("201").json({ message: "Update successful", user });
//                         });
//                     } else {
//                         res.status(400).json({ message: "User is already an Admin" });
//                     }
//                 })
//                 .catch((error) => {
//                     res
//                         .status(400)
//                         .json({ message: "An error occurred", error: error.message });
//                 });
        
//     }
// }

exports.updateUser = async(req,res,next) =>{
    console.log(req.body)
    const {username, fName, lName, email } = req.body

    if (!username){
        res.status(400).send({message : "invalid username"})
    }
    const user = await User.findOne({username : username})

    if (!user){
        res.status(404).send({message : "user not found"})
    }

    user.fName = fName
    user.lName = lName
    user.email = email

    user.save((err) =>{
        if (err){
        res.status(400).send({message : "an error occured", error : err.message})
        process.exit(1)
        }
        res.status(201).send({message : "update Successfull"})
    })


}

exports.deleteUser = async(req, res, next) => {
    const { id } = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user =>
            res.status(201).json({ message: "User successfully deleted", user })
        )
        .catch(error =>
            res
            .status(400)
            .json({ message: "An error occurred", error: error.message })
        )
}