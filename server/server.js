const express = require('express');
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const expressUploader = require('express-fileupload');
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();
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

require('./routes')(app, upload, client, fetch, path, fs, handleError, process.env.FILESTACK_KEY);

app.use(
  '/',
  express.static(path.join(__dirname, '../../imagegalleryfront/build'))
);

app.use(expressUploader());

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
