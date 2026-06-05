const express = require("express")
const router = express.Router()
const { isLogIn } = require("../middleware/isLogIn")
const validator = require("validator")




router.put("/complete", isLogIn,  async(req, res) => {
    try {
            const {firstName, lastName, dob, gender, bio, dp} = req.body
            const foundUser = req.user

            if(!firstName?.trim() || !lastName?.trim() || !dob?.trim() || !gender?.trim())
            {
                throw new Error("First name, last name, date of birth and gender are required")
            }

            if(!validator.isDate(dob))
            {
                throw new Error("Invalid Date")
            }

            foundUser.firstName = firstName
            foundUser.lastName = lastName
            foundUser.bio = bio
            foundUser.gender = gender
            foundUser.dateOfBirth = dob
            foundUser.displayPicture = dp
            foundUser. isCompleted = true

            await foundUser.save()

            res.status(200).json({
            success : true, 
            msg : "Profile updated",
            data : {
                email : foundUser.email,
                username : foundUser.username,
                firstName : foundUser.firstName,
                lastName : foundUser.lastName,
                bio : foundUser.bio,
                gender : foundUser.gender,
                dateOfBirth : foundUser.dob,
                displayPicture : foundUser.dp,
                followers : foundUser.followers,
                following : foundUser.following,
                posts : foundUser.posts,
                }
            })





    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }


})

router.put("/edit", isLogIn, async(req, res) => {
    try {
            const {firstName, lastName,  dp, bio} = req.body

            if(!firstName?.trim() || !lastName?.trim() || !dp?.trim() || !bio?.trim())
            {
                throw new Error("All fields are required")
            }

            const foundUser = req.user

            foundUser.firstName = firstName
            foundUser.lastName = lastName
            foundUser.dp = dp
            foundUser.bio = bio

            await foundUser.save()

            res.status(200).json({
                success : true,
                msg : "Profile updated",
                data : {
                    email : foundUser.email,
                    username : foundUser.username,
                    firstName : foundUser.firstName,
                    lastName : foundUser.lastName,
                    bio : foundUser.bio,
                    gender : foundUser.gender,
                    dateOfBirth : foundUser.dob,
                    displayPicture : foundUser.dp,
                    followers : foundUser.followers,
                    following : foundUser.following,
                    posts : foundUser.posts, 
                }   
            })



    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})

router.patch("/edit/dp", isLogIn, async(req, res) => {
    try {
            const {dp} = req.body

            if(!validator.isURL(dp))
            {
                throw new Error("Pls Provide a Valid Picture")
            }

            const foundUser = req.user
            foundUser.dp = dp
            await foundUser.save()

            res.json({
                status : true,
                msg : "Profile Picture Updated",
                data : {
                    email : foundUser.email,
                    username : foundUser.username,
                    firstName : foundUser.firstName,
                    lastName : foundUser.lastName,
                    bio : foundUser.bio,
                    gender : foundUser.gender,
                    dateOfBirth : foundUser.dob,
                    displayPicture : foundUser.dp,
                    followers : foundUser.followers,
                    following : foundUser.following,
                    posts : foundUser.posts,
                }
            })


    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})













module.exports = {
    profileRouter : router
}