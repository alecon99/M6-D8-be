const express = require('express')
const mongoose = require('mongoose')
const PostModel = require('../models/postModel')
const AuthorsModel = require('../models/authorModel')
const {postBodyParams, validatePostBody} = require('../middlewares/validatePost')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')

const router = express.Router()

cloudinary.config({
	cloud_name: process.env.CLOURINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "postImage",
		format: async (req, file) => "png",
		public_id: (req, file) => file.name,
	},
});

const cloudUpload = multer({ storage: cloudStorage });

router.post(
	"/post/cloudUploadImg",
	cloudUpload.single("cover"),
	async (req, res) => {
		try {
			res.status(200).json({ cover: req.file.path });
		} catch (error) {
			console.error("File upload failed:", error);
			res.status(500).json({ error: "File upload failed" });
		}
	}
);


/* ricerca post da utore */
router.get('/authors/:id/posts', async(req,res)=>{
    const {id} = req.params;

    try {
        const findAuthor = await AuthorsModel.findById(id);
        const findPost = await PostModel.find({ "autor": findAuthor})

        res.status(200).send({
            statusCode: 200,
            findAuthor,
            findPost
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata GET con titolo */
router.get('/posts/title', async(req,res)=>{
    const {postTitle} = req.query;

    try {
        const postByTitle= await PostModel.find({
                title: {
                $regex: '.*' + postTitle + '.*',
                $options: 'i',
                },
            })

        if(!postByTitle || postByTitle.length === 0){
            res.status(404).send({
                statusCode: 404,
                message: `Post with title ${postTitle} not found`
            })
        }

        res.status(200).send({
            statusCode: 200,
            postByTitle
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata GET */
router.get('/posts', async(req,res)=>{
    try {
        const posts = await PostModel.find().populate("author", "name surname avatar").populate("comments")
        const counter = await PostModel.count()
        
        res.status(200).send({
            statusCode: 200,
            counter,
            posts
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata GET con id */
router.get('/posts/:postId', async(req,res)=>{
    const {postId} = req.params;

    try {
        const postById= await PostModel.findById(postId)

        res.status(200).send({
            statusCode: 200,
            postById
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata POST */
router.post('/posts', /* postBodyParams, */ async(req,res)=>{
    
    const newPost = new PostModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: req.body.readTime,
        author: req.body.author,
        content: req.body.content
    })
    try {
        const post = await newPost.save();
        res.status(201).send({
            statusCode: 201,
            message: "Post successfully created",
            payload: post
        })
        
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata PUT */
router.put('/posts/:id',postBodyParams, validatePostBody, async(req,res)=>{
    const { id } = req.params

    const postExist = await PostModel.findById(id)

    if(!postExist){
        return res.status(404).send({
            statusCode: 404,
            message: `Post by id ${id} non found`
        })
    }

    const modPost = {
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: req.body.readTime,
        author: req.body.author,
        content: req.body.content
    }

    try {
        const result = await PostModel.findByIdAndUpdate(
            id,
            modPost,
            { new: true }
        )

        res.status(200).send({
            statusCode: 200,
            message: `Post with id ${id} modify successfully`,
            result
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D2 chiamata DELETE con id */
router.delete('/posts/:postId', async(req,res)=>{
    const { postId } = req.params;

    try {
        const deletePost= await PostModel.findByIdAndDelete(postId)

        res.status(200).send({
            statusCode: 200,
            message: `Post with id ${postId} delete successfully`,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error,
        })
    }
})

/* GET commenti post specifico */
/* router.get('/posts/:postId/comments', async(req,res)=>{
    const {postId} = req.params;

    try {
        const postById= await PostModel.findById(postId).populate("comments", "title content rating");

        res.status(200).send({
            statusCode: 200,
            postById
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error,
        })
    }
}) */

/* D4 GET commento specifico di post specifico */
/* router.get('/posts/:postId/comments/:commentId', async(req,res)=>{
    const {postId, commentId} = req.params;

    try {
        const postById = await PostModel.findById(postId);


        res.status(200).send({
            statusCode: 200,
            
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error,
        })
    }
}) */


module.exports = router;