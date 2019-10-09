const { Router } =require('express')
const router = Router();

const Photo = require('../models/Photo')
const cloudinary = require('cloudinary')
const fs = require('fs-extra')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get('/', async (req, res) => {
    const photos = await Photo.find();

    console.log(photos)
    res.render('images', {photos})
});

router.get('/images/add', async (req, res) => {
    const photos = await Photo.find();

    res.render('image_form',{photos});
});

router.post('/images/add', async (req, res) => {

    const { title, description} = req.body

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    
    //console.log(result)

    const newPhoto = new Photo({
        title,
        description,
        imageURL: result.url,
        public_id: result.public_id
    });
    await newPhoto.save();
    await fs.unlink(req.file.path);



    res.redirect('/')
});

router.get('/images/delete/:photo_id', async (req , res) => {
    const { photo_id } = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    res.redirect('/images/add')
})

/* router.get('/images/delete/:public_id' , (req, res) => {
    cloudinary.v2.uploade
}) */

module.exports = router