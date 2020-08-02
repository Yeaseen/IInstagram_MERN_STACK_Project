const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const requireLogin = require('../middleWare/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const cloudinary = require('cloudinary');
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })

})


router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body

    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please fill all the fields" })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user

    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })


})


router.get('/getsubpost',requireLogin,(req,res)=>{
    User.findById(req.user._id)
    .select("-password")
    .then(result=>{
        Post.find({postedBy:{$in:result.following}})
        .populate("postedBy","_id name pic")
        .populate("comments.postedBy","_id name pic")
        .sort('-createdAt')
        .then(posts=>{
            res.json({posts})
    }).catch(err=>{
            console.log(err)
        })
    })

})


router.get('/mypost', requireLogin, (req, res) => {
    User.findOne({_id:req.user._id})
    .select("-password")
    .then(selfuser=>{
        Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .exec((err,selfposts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({selfuser,selfposts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"W R O N G"})
    })
})



router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments:comment}
    }, {
        new: true
    }).populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})



router.delete('/deletepost/:postId',requireLogin,(req,res)=>{

    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err, post)=>{
        if (err || !post) {
            return res.status(422).json({ error: err })
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
                
                const fullURL = post.photo
                const shortenURL = fullURL.split("/").pop().split('.')[0]
                
                cloudinary.v2.uploader.destroy(shortenURL,resource_type='image',(error,result)=>{
                    //console.log(result,error)
                    post.remove()
                    .then(result=>{
                        res.json(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                })   
        }
    })
})

router.put('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.params.postId, {
        $pull: { 'comments' : {
            _id:req.params.commentId
        } }
    }, {
        new:true
    }).populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
   
})


module.exports = router
