module.exports = (app) => {
    app.get('/images', (req, res) => {
        res.json({ url: 'sample urls' })
    }),
    app.get('/image', (req, res) => {
        res.json({ url: 'sample url' })
    })
}
