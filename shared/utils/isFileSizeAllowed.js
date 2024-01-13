/* eslint-disable no-new */
const stream = require('stream');

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

const isFileSizeAllowed = async (createReadStream, maxSize) => {
    const sizeStream = new stream.PassThrough();
    let fileSize = 0;

    sizeStream.on('data', (chunk => {
        fileSize += chunk.length;
    }));

    await new Promise((resolve, reject) => {
        createReadStream()
            .pipe(sizeStream)
            .on('finish', resolve)
            .on('error', reject)
    });

    if (fileSize > MAX_FILE_SIZE){
        return false
    }

    return true;
}

module.exports = { isFileSizeAllowed }