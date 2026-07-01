const express = require("express")
const router = express.Router()
const { isLogIn } = require("../middleware/isLogIn")
const validator = require("validator")
const {user} = require("../model/user.model")
const {Post} = require("../model/post.model")
const mongoose = require("mongoose")



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

router.get("/following-posts", isLogIn, async (req, res) => {
  try {
    
   const {skip} = req.query
   const currentUser = req.user;
    

    
    const loggedInUser = await user.findById(currentUser._id).select("following");
    

    if (!loggedInUser) {
      throw new Error("User not found");
    }

    const followingIds = loggedInUser.following; // array of ObjectIds jinhe follow kiya hai

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate("user", "username dp firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "authorId",
          select: "username dp firstName lastName",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
     
    res.status(400).json({
      success: false,
      err: error.message,
    });
  }
});

router.get("/my-posts", isLogIn, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }); 

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "No posts found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      err: error.message,
    });
  }
});

router.get("/:id", isLogIn, async(req, res) => {
    try {
            const {id} = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid Id")
            
            }

            const post = await Post.findById(id)

            if(!post)
            {
                throw new Error("post not found")
            }

            res.status(200).json({
                success: true,
                post
            })



    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

router.delete("/:postId", isLogIn, async (req, res) => {
    try {
        const { postId } = req.params
        const foundUser = req.user

        const post = await Post.findById(postId)

        if (!post) {
           throw new Error("Post not found")
        }

        if (post.user.toString() !== foundUser._id.toString()) { 
            throw new Error("You are not authorized to perform this action")
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})



router.put("/:id", isLogIn, async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("Post not found")
    }

    if (post.user.toString() !== req.user._id.toString()) { // ✅ "user" field
      throw new Error("You are not authorized to edit this post");
    }

    if (caption !== undefined) {
      post.caption = caption;
    }

    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }

    await post.save();

    res.status(200).json({
      success: true,
      msg: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      err: error.message,
    });
  }
});


router.patch("/like/:postId", isLogIn, async (req, res) => {
  try 
  {
    const post = await Post.findById(req.params.postId);

    if (!post) 
    {
      throw new Error("Post not found");
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) 
      {
      await Post.findByIdAndUpdate(req.params.postId, {
        $pull: {
          likes: userId,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Post disliked successfully",
      });
    }

    await Post.findByIdAndUpdate(req.params.postId, {
      $push: {
        likes: userId,
      },
    });

    res.status(200).json({
      success: true,
      msg: "Post liked successfully",
    });
  } 
  catch (error) 
  {
    res.status(400).json({
      success: false,
      err: error.message,
    });
  }
})




module.exports = {
    postRouter : router
}