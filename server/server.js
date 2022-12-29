const express = require('express');
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const expressUploader = require('express-fileupload');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nick:Eg3xdOC98f8XwLyf@imageboard.e6qiv9o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express()
const port = 3000;

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./temp"
});

app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        const image = fs.readFileSync(path.join(__dirname, './uploads/image.png'))


        fetch('https://www.filestackapi.com/api/store/S3?key=AXMdyQTRfS09C3ad6mSRgz', 
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
            // perform actions on the collection object
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


        //MongoDB Username: Nick PW: Eg3xdOC98f8XwLyf

        //
        //
        // res //DO NOT BLOAT FILESTACK
        //   .status(200)
        //   .contentType("text/plain")
        //   .end("File uploaded!");
        //
        // 
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

app.use(
  '/',
  express.static(path.join(__dirname, '../../imagegalleryfront/build'))
);

app.use(expressUploader());

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
