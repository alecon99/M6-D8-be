const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const AuthorsModel = require('../models/authorModel')
const {authorBodyParams, validateAuthorBody} = require('../middlewares/validateAuthor')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const crypto = require('crypto')

const router = express.Router()

cloudinary.config({
	cloud_name: "dywsxtumm",
	api_key: "772313929559575",
	api_secret: "uvh0Se-1vCk6zQmGDrboChyNVpw",
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "authorImage",
		format: async (req, file) => "png",
		public_id: (req, file) => file.name,
	},
});

/* const internalStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = file.originalname.split(".").pop();
		cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
	},
});
 */
/* const uploads = multer({ storage: internalStorage }); */
const cloudUpload = multer({ storage: cloudStorage });

/* router.post("/author/internalUpload", uploads.single("avatar"), async (req, res) => {
	const url = req.protocol + "://" + req.get("host");
	try {
		const imgUrl = req.file.filename;
		res.status(200).json({ avatar: `${url}/uploads/${imgUrl}` });
	} catch (error) {
		console.error("File upload failed:", error);
		res.status(500).json({ error: "File upload failed" });
	}
});
 */
router.post(
	"/author/cloudUploadImg",
	cloudUpload.single("avatar"),
	async (req, res) => {
		try {
			res.status(200).json({ avatar: req.file.path });
		} catch (error) {
			console.error("File upload failed:", error);
			res.status(500).json({ error: "File upload failed" });
		}
	}
);

/* chiamata GET */
router.get('/authors', async(req,res)=>{

    try {
        const authors = await AuthorsModel.find().populate()

        res.status(200).send({
            statusCode: 200,
            authors
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* chiamata GET specifico id */
router.get('/authors/:authorId', async(req,res)=>{
    const {authorId} = req.params;

    try {
        const authorById= await AuthorsModel.findById(authorId)

        res.status(200).send({
            statusCode: 200,
            authorById
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* chiamata POST */
router.post('/author/newAuthor', validateAuthorBody, async(req,res)=>{
    
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newAuthor = new AuthorsModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        dateOfBirth: req.body.dateOfBirth,
        avatar: req.body.avatar

    })
    try {
        const author = await newAuthor.save();
        res.status(201).send({
            statusCode: 201,
            message: "Author successfully created",
            payload: author
        })
        
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* chiamata PUT */
router.put('/authors/:id/modAuthor',authorBodyParams, validateAuthorBody, async(req,res)=>{
    const { id } = req.params

    const postExist = await AuthorsModel.findById(id)

    if(!postExist){
        return res.status(404).send({
            statusCode: 404,
            message: `Author by id ${id} non found`
        })
    }

    const modAuthor = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        avatar: req.body.avatar
    }

    try {
        const dataToUpdate = modAuthor;
        const newObject = { new: true };

        const result = await AuthorsModel.findByIdAndUpdate(id,dataToUpdate,newObject)

        res.status(200).send({
            statusCode: 200,
            message: `Author with id ${id} modify successfully`,
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

/* chiamata DELETE */
router.delete('/authors/:authorId/delAuthor', async(req,res)=>{
    const {authorId} = req.params;

    try {
        const deleteAuthor= await AuthorsModel.findByIdAndDelete(authorId)

        res.status(200).send({
            statusCode: 200,
            message: `Author with id ${authorId} delete successfully`,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

module.exports = router;