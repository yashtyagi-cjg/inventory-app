const asyncHandler = require('express-async-handler')
const fs = require('fs');


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
        console.log("Uploading image from: " + imagePath)
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log("Cloudinary upload successful:", JSON.stringify(result));
        
        fs.rm(imagePath, (deleteErr)=>{
            if(deleteErr){
                console.log("Falied to delete local image file: ", imagePath);
                console.log(deleteError)
            }else{
                console.log("Local image file deleted: ", imagePath)
            }
        })
        return result;
    
})

exports.downloadImage = asyncHandler(async(publicId)=>{
    const options = {
        colors: true,
    }

    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.colors;
})