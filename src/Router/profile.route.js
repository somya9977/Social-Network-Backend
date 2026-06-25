const express = require("express")
const router = express.Router()
const { isLogIn } = require("../middleware/isLogIn")
const validator = require("validator")
const { user } = require("../model/user.model")




router.put("/complete", isLogIn,  async(req, res) => {
    try {
            console.log(req.body)
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
            foundUser.dob = dob
            foundUser.dp = dp
            foundUser. isCompleted = true

            console.log("After assignment:", foundUser.dob)

            await foundUser.save()

            console.log("After save:", foundUser.dob)

            res.status(200).json({
            success : true, 
            msg : "Profile updated",
            user : {
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

router.patch("/edit", isLogIn, async(req, res) => {
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
                user : {
                    email : foundUser.email,
                    username : foundUser.username,
                    firstName : foundUser.firstName,
                    lastName : foundUser.lastName,
                    bio : foundUser.bio,
                    gender : foundUser.gender,
                    dateOfBirth : foundUser.dob,
                    dp : foundUser.dp,
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

router.patch("/follow-unfollow/:id", isLogIn, async (req, res) => {
    try {
        const { id: targetUserId } = req.params
        const currentUser = req.user

        if (targetUserId === currentUser._id.toString()) {
            throw new Error("You cannot follow yourself")
        }

        const targetUser = await user.findById(targetUserId)

        if (!targetUser) {
            throw new Error("User not found")
        }

        const isFollowing = currentUser.following.some(
            (id) => id.toString() === targetUserId
        )

        if (isFollowing) {
            
            currentUser.following.pull(targetUserId)
            targetUser.followers.pull(currentUser._id)
        } else {
           
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUser._id)
        }

        await currentUser.save()
        await targetUser.save()

        res.status(200).json({
            success: true,
            msg: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            isFollowing: !isFollowing,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            err: error.message
        })
    }
})
router.get("/search", isLogIn, async (req, res) => {
    try {
            const {query, skip} = req.query
            const foundUser = req.user

            if(!query || query.trim() === "")
            {
                return res.status(200).json({
                    sucess : true,
                    data : []
                })
            }

            const users = await user.find({
                username : {$regex : query, $options : "i"},
                _id : {$ne :foundUser.id } 
            })
            .select("username firstName lastName dp")
            .limit(5)
            .skip(skip)

            res.status(200).json({
                sucess : true,
                msg: "Users fetched",
                data: users
            })


    } catch (error) {
            res.status(400).json({
            err: error.message
        })
    }


})
router.get("/:id", isLogIn, async (req, res) => {
    try {
        const { id } = req.params
        const myId = req.user.id   // logged-in user ka id (auth middleware se)

        const foundUser = await user.findById(id)
            .select("username firstName lastName bio  dp followers following posts  dob createdAt")
            .populate("posts")

        if (!foundUser) {
            throw new Error("User not found")
        }

        const isFollowing = foundUser.followers.some(
            (followerId) => followerId.toString() === myId
        )

        res.status(200).json({
            success: true,
            data: {
                ...foundUser.toObject(),
                isFollowing
            }
        })

    } catch (error) {
        res.status(404).json({
            err: error.message
        })
    }
})











module.exports = {
    profileRouter : router
}