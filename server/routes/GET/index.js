module.exports = (app, client) => {
    app.get('/images', async (req, res) => {
        
        const collection = client.db("ImageBoard").collection("devices");
        const allImages = collection.find()
        const response = []
        await allImages.forEach(pic => response.push(pic));
        
        res.json({ images: response })

    }),
    app.get('/image', (req, res) => {
        res.json({ url: 'sample url' })
    })
}
