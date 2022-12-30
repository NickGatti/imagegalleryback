module.exports = (app, upload, collection, fetch, path, fs, handleError, FILESTACK_KEY) => {
    require('./GET')(app, collection)
    require('./POST')(app, upload, collection, fetch, path, fs, handleError, FILESTACK_KEY)
}
