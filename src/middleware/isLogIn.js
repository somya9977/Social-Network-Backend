const jwt = require("jsonwebtoken")
const {user} = require("../model/user.model")


const isLogIn = async(req, res, next) => {
    try {
          const {token} = req.cookies

          const decode = jwt.verify(token, process.env.JWT_TOKEN)
          const foundUser = await user.findById(decode.id)

          if(!foundUser)
          {
            throw new Error("Pls login first")
          }

          req.user = foundUser
          next()



    } catch (error) {
        res.status(400).json({
            err : error.message
        }) 
    }
}

module.exports = {
    isLogIn
}