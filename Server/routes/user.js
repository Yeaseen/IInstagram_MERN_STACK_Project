const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const requireLogin = require('../middleWare/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.get('/user/:userid',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.userid})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.userid})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            const isFollower = user.followers.includes(req.user._id)
            res.json({user,posts,isFollower})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not FOUND!"})
    })
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push: {following:req.body.followId}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.body.followId,{
            $push: {followers : req.user._id }
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull: {following:req.body.unfollowId}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.body.unfollowId,{
            $pull: {followers : req.user._id }
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
})


module.exports = router