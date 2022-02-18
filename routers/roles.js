// library
const express = require('express');
const router = express.Router();

// domain based
const repositoryRole = require('../domains/roles/repository');
const ROLE_MODEL = require('../models').roles

router.get('/', (req, res, next) => {
    ROLE_MODEL.findAll().then(result=>{
        res.json(
            {
                message : "OK",
                data : result
            }
        )
    }).catch(error => res.json({
        message:error.message
    }))
});

router.get('/:id', (req,res, next)=>{
    const roleId = req.params.id
    ROLE_MODEL.findOne({
        where : {
            id : roleId
        }
    }).then(result=>{
        res.json(
            {
                message : "OK",
                data : result
            }
        )
    }).catch(error => res.json({
        message:error.message
    }))
})

module.exports = router;