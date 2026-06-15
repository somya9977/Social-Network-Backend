const express = require("express")
const router = express.Router()
const { isLogIn } = require("../middleware/isLogIn")
const validator = require("validator")
// const {Post} = require("../model/post.model")
const {user} = require("../model/user.model")
const {Post} = require("../model/post.model")


router.post('/create-post', isLogIn, async(req, res) => {
    try {
            const { image, caption } = req.body
             if (!image?.trim()){
                throw new Error("Post image is required")
             }

             const foundUser = req.user
             const post = await Post.create({
             user: foundUser._id,
             image,
             caption: caption?.trim() || "",
             })

             foundUser.posts.push(post._id)

             await foundUser.save()

             res.status(201).json({
             success: true,
             msg: "Post created successfully",
             post,
             })

             
                
    } catch (error) {
        res.status(400).json({
            success: false,
            err: error.message
        })
    }
})
        








module.exports = {
    postRouter : router
}