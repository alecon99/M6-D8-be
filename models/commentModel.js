const mongoose = require('mongoose')

const CommentModelSchema = new mongoose.Schema(
    {
        postId:{
            type: String,
            require: true
        },
        author: {
            name:{
                type: String,
                require: true
            },
            surname: {
                type: String,
                require: true
            },
            avatar: {
                type: String,
			    required: true,
            },
            id: {
                type: String,
                require: true
            }
        },
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        rating: {
            type: Number,
            require: true,
            min: 1,
            max: 5,
            default: 1
        },
    },
    {
        timestamps: true, 
        strict: true
    }
)

module.exports = mongoose.model('Comment', CommentModelSchema, "comments" )
