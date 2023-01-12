module.exports = (app, collection) => {
    app.get('/images', async (req, res) => {
        const allImages = collection.find();
        const response = [];
        await allImages.forEach(pic => response.push(pic));

        res.json({ images: response });
    }),
    app.get('/image', (req, res) => {
        res.json({ url: 'sample url' });
    })
};
