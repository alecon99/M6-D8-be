const express = require('express');
const mongoose = require('mongoose');
const ResourcesModel = require('../models/resourcesModel');

const router = express.Router()

/* D3 GET tutto */
router.get('/resources', async(req,res)=>{
    try {
        const collections = await ResourcesModel.find()
        const counter =  await ResourcesModel.count()

        res.status(200).send({
            statusCode: 200,
            counter,
            collections
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }
})

/* D3 GET isActive */
router.get('/resources/isActive', async(req,res)=>{
    try {
        const counter = await ResourcesModel.find({ "isActive": true }).count()
        const findIsActive = await ResourcesModel.find({ "isActive": true })

        res.status(200).send({
            statusCode: 200,
            counter,
            findIsActive
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})

/* D3 GET età maggiore di */
router.get('/resources/ageGreaterThan', async(req,res)=>{
    const { age } = req.query

    try {
        const counter = await ResourcesModel.find({ "age": { $gt: age }}).count()
        const ageGreaterThan = await ResourcesModel.find({ "age": { $gt: age }})
        
        res.status(200).send({
            statusCode: 200,
            counter,
            ageGreaterThan
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})

/* D3 GET età compresa age1 e minore o uguale a age2 */
router.get('/resources/betweenTheAgesOf', async(req,res)=>{
    const { age1 , age2 } = req.query
    
    try {
        const counter = await ResourcesModel.find({ "age": {
            $gt: age1,
            $lte: age2
        }}).count()
        const betweenTheAgesOf = await ResourcesModel.find({ "age": {
                $gt: age1,
                $lte: age2
            }})
        
        res.status(200).send({
            statusCode: 200,
            counter,
            betweenTheAgesOf
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})

/* D3 GET eyes uguali ad eyes1 e eyes2*/
router.get('/resources/eyesEqualTo', async(req,res)=>{
    const { eyes1 , eyes2 } = req.query

    try {
        const eyesEqualTo = await ResourcesModel.find( 
        { 
            $or : [
                {
                    "eyeColor": eyes1
                },
                {
                    "eyeColor": eyes2
                }
            ]
        })
        
        res.status(200).send({
            statusCode: 200,
            eyesEqualTo
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})

/* D3 GET occhi non uguali a eyes */
router.get('/resources/eyesNotEqualTo', async(req,res)=>{
    const {eyes} = req.query
    try {
        /* const counter = await ResourcesModel.find({ "eyeColor": true }).count() */
        const eyesNotEqualTo = await ResourcesModel.find({ "eyeColor": { $ne: eyes } })

        res.status(200).send({
            statusCode: 200,
            eyesNotEqualTo
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})

/* D3 GET occhi non uguali a eyes1 e eyes2 */
router.get('/resources/eyesNotIncluded', async(req,res)=>{
    const {eyes1,eyes2} = req.query
    try {
        const eyesNotEqualTo = await ResourcesModel.find(
            { "eyeColor": {$nin: [ eyes1,eyes2 ]}},{ "name.first":1 , eyeColor:1 });

        res.status(200).send({
            statusCode: 200,
            eyesNotEqualTo
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server error",
            error
        })
    }  
})


/* D3 GET company return email */
router.get('/resources/company', async(req,res)=>{
    const { company } = req.query

    try {
        const findCompany = await ResourcesModel.find({ "company": company }).select("email");

        res.status(200).send({
            statusCode: 200,
            findCompany
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