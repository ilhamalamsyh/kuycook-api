const { UserInputError } = require('apollo-server-express');
const { GraphQLUpload } = require('graphql-upload');
const fs = require("fs");
const stream = require('stream');
const { generateUniqueFilename } = require('../../../shared/utils/generateUniqueFilename');
const { uploadToCloudinary } = require("../../../shared/utils/uploadFile");
const {isImage} = require("../../../shared/utils/isImage");
const {isFileSizeAllowed} = require("../../../shared/utils/isFileSizeAllowed");

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

module.exports = {
    Upload: GraphQLUpload,

    Mutation: {
        singleUploadImage: async (parent, { type ,file }) => {
            const { filename, mimetype, createReadStream } = await file;

            try {
                const allowedFileSize = await isFileSizeAllowed(createReadStream, MAX_FILE_SIZE);

                if (!allowedFileSize){
                    throw new UserInputError(`File size exceeds the limit of 4MB.`);
                }

            }catch (error) {
                throw new UserInputError(error.message);
            }

            const uniqueFilename = generateUniqueFilename(filename);
            let response = '';

            try {
                if (!isImage(mimetype)){
                    throw new UserInputError('File should be an image format');
                }

                response = await uploadToCloudinary(createReadStream, uniqueFilename, type);
            }catch (error){
                throw new UserInputError(error.message);
            }

            return response.secure_url;
        }
    }
}
