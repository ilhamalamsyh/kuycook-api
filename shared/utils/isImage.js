const isImage = (file) => {
    const imageMimeType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

    if (!imageMimeType.includes(file)){
        return false;
    };

    return true;
}

module.exports = { isImage }