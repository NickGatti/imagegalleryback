module.exports = (app, upload, collection, fetch, path, fs, handleError, FILESTACK_KEY) => {
  app.post(
    "/upload",
    upload.single("file"),
    (req, res) => {
      if (!req.file) {
        console.log('File undefined.')
        return
      }
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "../../uploads/image.png");

      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          const image = fs.readFileSync(path.join(__dirname, '../../uploads/image.png'));

          fetch(`https://www.filestackapi.com/api/store/S3?key=${FILESTACK_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "image/png" },
              body: image
            }).then(resp => {
              return resp.json()
            }).then(resp => {
              console.log('Filestack Upload Success!', resp);

              collection.insertOne(resp).then(mongoRes => {
                console.log('Success Mongo Insert:', mongoRes);
              }).catch(mongoErr => {
                console.log('Failure Mongo Insert:', mongoErr);
              })

              res.json(resp); //The json response from filestack
            }).catch(err => {
              console.log('Error POST /images', err);
            });
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
};
