const jwt = require("jsonwebtoken")
const jwtSecret = process.env.jwtSecret

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.JWTSECRET
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({ message: "Not authorized" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.header('x-auth-token');
    // console.log(token)
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized 1" })
            } else {
                if (decodedToken.role !== "Basic") {
                    return res.status(401).json({ message: "Not authorized 2" })
                } else {
                   req.user ={}
                   req.user.id=decoded.id
                   req.user.username = decoded.username

                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available 3" })
    }
}