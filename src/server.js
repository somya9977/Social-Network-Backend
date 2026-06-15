require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = process.env.PORT || 8000;
const {authrouter} = require("./Router/auth.route")
const {profileRouter} = require("./Router/profile.route")
const {postRouter} = require("./Router/post.route")
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authrouter)
app.use("/api/profile", profileRouter)
app.use("/api/post",postRouter )

app.use((req, res) => {
    res.status(404).json({
        err : "Not Found"
    })
})







mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connected")

    app.listen(port, () => {
        console.log(`server running on ${port}`)
    })
})
.catch((err) => {
    console.log("DB not connected")
    console.log(err.message)
})