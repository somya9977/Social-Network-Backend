const express = require("express")
const router = express.Router()
const OTP = require("../model/otp.model")
const { Resend } = require("resend")
const { varifyMail} = require("../model/varifyMail.model")
const validator = require("validator")
const {user} = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



const resend = new Resend(process.env.RESEND_API_KEY)

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    const genotp = Math.floor(100000 + Math.random() * 900000)

    const createOtp = await OTP.create({
      email,
      otp : genotp.toString()
    })


    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is:</p>
        <h1>${genotp}</h1>
        <p>This OTP will expire soon.</p>
      `,
    })


    res.status(201).json({
      success: true,
      
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

router.post("/varify-mail", async(req, res) => {
  try {
      const {email, otp} = req.body
      const foundOtp = await OTP.findOne({
        email, otp: otp.toString()
      })

      if(!foundOtp)
      {
        throw new Error("Invalid Otp")
      }

      const savedMail = await varifyMail.create({
        email,
      })
      

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      })

  } 
  catch (error) {
      res.status(400).json({
        msg : error.message
      })
  }
})

router.post("/signup", async(req, res) => {
  try {
         const {email, username, password} = req.body

          if(!email || !username || !password)
          {
            throw new Error("Pls enter all feild")
          }

          if(!validator.isEmail(email))
          {
            throw new Error("Pls enter valid email")
          }

          if(!validator.isStrongPassword(password))
          {
            throw new Error("Pls enter Strong Password")
          }

          if (username.length < 2 || username.length > 10) {
              throw new Error("Please enter a username between 2 and 10 characters");
            }

            const foundMail = await varifyMail.findOne({email})

            if(!foundMail)
            {
              throw new Error("Pls varify mail first")
            }
           
          const hashedPassword = await bcrypt.hash(password, 10)
          
          const createUser = await user.create({
            email,
            username,
            password: hashedPassword,
          })
          
          res.status(200).json({
            status : true,
            data : createUser
          })



  } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        })
  }
})

router.post("/login", async(req, res) => {
  try {
        const { email, username, password } = req.body
        
        if (!password) 
        {
          throw new Error("Password is required");
        }

        const foundUser = await user.findOne({
        $or : [
          { email: email },
          { username: username }
          ]
        })  

        if(!foundUser)
        {
          throw new Error("User not define")
        }

        const isMatch = await bcrypt.compare(password, foundUser.password)

        if(!isMatch)
        {
          throw new Error("Invalid credentials")
        }

        const token = jwt.sign({id : foundUser._id},process.env.JWT_TOKEN, {expiresIn: "7d"} )


        res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        })



        res.status(200).json({
        success: true,
        message: "Login successful",
        })



  } catch (error) {
      res.status(400).json({
      success: false,
      message: error.message,
      })
  }

})

router.post("/logout", (req, res) => {
  try {
          res.status(200).cookie("token", "").json({
          success : true,
          msg : "User logged out.."
          })

  } catch (error) {
      res.status(500).json({
      success: false,
      message: error.message,
      })
  }
});


module.exports = {
  authrouter : router
}
