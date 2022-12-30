module.exports = (app, upload, client, fetch, path, fs, handleError, FILESTACK_KEY) => {
    require('./GET')(app, client)
    require('./POST')(app, upload, client, fetch, path, fs, handleError, FILESTACK_KEY)
}
