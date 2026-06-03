require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;
const {authrouter} = require("./auth/auth.route");


app.use(express.json());
app.use("/api/auth", authrouter)



mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connected");

    app.listen(port, () => {
        console.log(`server running on ${port}`);
    });
})
.catch((err) => {
    console.log("DB not connected");
    console.log(err.message);
});