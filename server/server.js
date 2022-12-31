const express = require('express');
const app = express();
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const expressUploader = require('express-fileupload');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./temp"
});

client.connect(mongoDBConnectErr => {
  if (!mongoDBConnectErr) {
    console.log('Success DB Connect.')
  } else {
    console.log('Failure DB Connect.', mongoDBConnectErr)
  }
});

const collection = client.db("ImageBoard").collection("devices");

require('./routes')(app, upload, collection, fetch, path, fs, handleError, process.env.FILESTACK_KEY);

app.use(
  '/',
  express.static(path.join(__dirname, '../public'),
  expressUploader()
  )
);

app.listen(3000, () => {
  console.log(`App running on port 3000`)
});
