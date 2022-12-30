module.exports = (app, upload, client, fetch, path, fs, handleError, FILESTACK_KEY) => {
    app.post(
        "/upload",
        upload.single("file"),
        (req, res) => {
          const tempPath = req.file.path;
          const targetPath = path.join(__dirname, "../../uploads/image.png");
      
          if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
              if (err) return handleError(err, res);
      
              const image = fs.readFileSync(path.join(__dirname, '../../uploads/image.png'))
      
              fetch(`https://www.filestackapi.com/api/store/S3?key=${FILESTACK_KEY}`, 
              {
                method: "POST",
                headers: { "Content-Type": "image/png"},
                body: image
              }).then(resp => {
                return resp.json()
              }).then(resp => {
                console.log('Filestack Upload Success!', resp)
      
                client.connect(mongoDBConnectErr => {
                  if (!mongoDBConnectErr) {
                    console.log('Success DB Connect.')
                  } else {
                    console.log('Failure DB Connect.', mongoDBConnectErr)
                  }
                  const collection = client.db("ImageBoard").collection("devices");

                  collection.insertOne(resp).then(mongoRes => {
                    console.log('Success Mongo Insert:', mongoRes)
                    client.close();
                  }).catch(mongoErr => {
                    console.log('Failure Mongo Insert:', mongoErr)
                    client.close();
                  })
                });
      
                res.json(resp) //The json response from filestack
              }).catch(console.error)
            });
          } else {
            fs.unlink(tempPath, err => {
              if (err) return handleError(err, res);
      
              res
                .status(403)
                .contentType("text/plain")
                .end("Only .png files are allowed!");
            });
          }
        }
      );
}
