const express = require("express")
const router = express.Router()
const OTP = require("../model/otp.model")
const { Resend } = require("resend")
const { varifyMail} = require("../model/varifyMail.model")



const resend = new Resend(process.env.RESEND_API_KEY)

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

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


module.exports = router
