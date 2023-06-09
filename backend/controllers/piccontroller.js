const express = require("express")
const router = express.Router()
const fs = require("fs");
const multer = require("multer");
const  ImageSchema = require("../models/PicSchema.js")

// Get All ImageSchema
router.get('/', function (req, res, next) {
    ImageSchema.find({}).then(function (element) {
        res.send(element);
    }).catch(next);
});

//Get One ImageSchema
router.get('/id/:id', function (req, res, next) {
    ImageSchema.findOne({id: req.params.id}).then(function(element){
        res.send(element);
    }).catch(next);
});

//Get ImageSchema By User
router.get('/user/:user', function (req, res, next) {
    ImageSchema.find({user: req.params.user}).then(function(element){
        res.send(element);
    }).catch(next);
});

// add a new ImageSchema 
router.post('/',function(req,res,next){
    console.log(req.body.id);
    ImageSchema.create(req.body).then(function(element){
        res.send(element);
    }).catch(next);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/imagePost', upload.single("image") , (req,res)=>{
    console.log("in image post 2")
    // console.log(req.body.objectData)
    console.log(JSON.parse(req.body.objectData))
    const reqObjectData = JSON.parse(req.body.objectData)
    console.log(req.file)
    ImageSchema.create({
        id:reqObjectData.id,
        location:reqObjectData.location,
        caption:reqObjectData.caption,
        image:{
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/png"
        },
        tags:reqObjectData.tags
    })
    .then(function(element){
        res.send(element);
    }).catch();
} )

// update a ImageSchema
router.put('/:id',function(req,res,next){
    ImageSchema.findOneAndUpdate({id: req.params.id},req.body).then(function(element){
        ImageSchema.findOne({id: req.params.id}).then(function(element){
            res.send(element);
        });
    });
});

// delete a ImageSchema 
router.delete('/:id',function(req,res,next){
    ImageSchema.findOneAndDelete({id: req.params.id}).then(function(element){
        res.send(element);
    });
});

// delete all ImageSchema
router.delete('/',function(req,res,next){
    ImageSchema.deleteMany(req.body).then(function(element){
        res.send(element);
    }).catch(next);
});

module.exports = router