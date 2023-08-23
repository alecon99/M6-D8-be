const express = require('express')
const mongoose = require('mongoose')
const CommentModel = require('../models/commentModel')
const PostModel = require('../models/postModel')
const {commentBodyParams, validateCommentBody} = require('../middlewares/validateComment')

const router = express.Router()

/* nuovo commento collegato ad autore e post specifici */
router.post('/newComment/:postId', validateCommentBody, async(req,res)=>{
    const { postId } = req.params;

    const newComment = new CommentModel({
        postId: postId,
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        rating: req.body.rating,
    })
    try {
        const update = { $push: { comments: newComment}};

        const updateComment = await PostModel.findOneAndUpdate(
            { _id: postId},
            update,
            { new: true}
        )


        await newComment.save();

        res.status(201).send({
            statusCode: 201,
            message: "Comment successfully created",
            updateComment
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
} )

/* modifica commento */
router.put('/comments/:commentId/modComment',commentBodyParams, validateCommentBody, async(req,res)=>{
    const {commentId} = req.params;

    const commentExist = await CommentModel.findById(commentId)

    if(!commentExist){
        return res.status(404).send({
            statusCode: 404,
            message: `Comment by id ${commentId} non found`
        })
    }

    const modComment = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        rating: req.body.rating,
    }
    try {
        const updateComment = await CommentModel.findByIdAndUpdate(
            commentId,
            modComment,
            { new: true}
        )

        res.status(201).send({
            statusCode: 201,
            message: `Comment with id ${commentId} modify successfully`,
            updateComment
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
} )

router.delete('/deleteComment/:commentId', async(req,res)=>{
    const { commentId } = req.params;

    try {
        const deletePost= await CommentModel.findByIdAndDelete(commentId)

        res.status(200).send({
            statusCode: 200,
            message: `Comment with id ${commentId} delete successfully`,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error,
        })
    }
})

router.get('/comments/:postId', async(req,res)=>{
    const { postId } = req.params;

    try {
        const commentsById= await CommentModel.find({ postId: postId})

        res.status(200).send({
            statusCode: 200,
            commentsById
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error,
        })
    }
})

module.exports = router;