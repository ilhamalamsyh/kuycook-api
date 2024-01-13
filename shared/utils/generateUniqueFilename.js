const {v4: uuid}  =require('uuid');

const generateUniqueFilename = () => {
        // step 1 - ensure filename is unique by appending a UUID
        const unique = uuid();

        // step 2 - return the unique filename
        return `${unique}`;
}

module.exports = { generateUniqueFilename };