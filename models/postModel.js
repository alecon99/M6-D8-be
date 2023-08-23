const mongoose = require('mongoose');

const PostModelSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        cover:{
            type: String,
            required: true,
        },
        readTime:{
            value:{
                type: Number,
                required: true,
                default: "5"
            },
            unit:{
                type: String,
                required: true,
                default: "minutes"
            }
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author"
        },
        content:{
            type: String,
            required: true
        },
        comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            },
        ],
    },
    { 
        timestamps: true, 
        strict: true 
    }
);

module.exports = mongoose.model("Post", PostModelSchema, "posts");

