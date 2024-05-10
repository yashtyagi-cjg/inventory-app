const asyncHandler = require('express-async-handler')


//CLOUDINARY
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure:true
})

exports.uploadImage = asyncHandler(async(imagePath)=>{
    const options = {
        use_filename: true,
        uniquefilename: true,
        overwrite: false,
    };
    
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
})

exports.downloadImage = asyncHandler(async(publicId)=>{
    const options = {
        colors: true,
    }

    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.colors;
})