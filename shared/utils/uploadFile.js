const { cloudinary } = require('./config/cloudinary');
const {CLOUDINARY_STAGING, CLOUDINARY_PRODUCTION} = require("../constants/cloudinary");

const env = process.env.NODE_ENV || 'development';

const uploadToCloudinary = (createReadStream, filename, type) => new Promise((resolve, reject) => {
    const cloudinaryEnv = env === 'development' ? CLOUDINARY_STAGING : CLOUDINARY_PRODUCTION;
        const stream = cloudinary.uploader.upload_stream(
            { public_id: `${cloudinaryEnv}/${type}/${filename}` },
            (error, result) => {
                if (error) {
                    reject(error);
                }else{
                    resolve(result);
                }
            }
        );

        createReadStream().pipe(stream);
    });

module.exports = { uploadToCloudinary }