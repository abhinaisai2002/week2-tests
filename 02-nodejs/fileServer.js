/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

function getFiles(path) {

  return new Promise((res, rej) => {
    fs.readdir(path, function (err, data) {
      if (err) {
        rej(err);
      }
      // console.log(data);
      res(data);
    })
  })

}

function getFile(path) {
  return new Promise((res, rej) => {
    fs.readFile(path, function (err, data) {
      if (err) {
        // console.log(err);
        rej(err);
      }
      res(data);
    })
  })
}

app.get('/files', async function (req,res) {

  try {
    const files = await getFiles(path.join(__dirname, 'files'));
    
    res.status(200).send(files);
  }
  catch (err) {
    res.status(500).send("Internal Server Error");
  }

})

app.get('/file/:filename', async function (req, res) {
  let fileName = req.params.filename;

  try {
    const fileData = await getFile(path.join(__dirname, 'files', fileName));
    res.status(200)
      .send(fileData.toString());
  }
  catch (err) {
    // console.log(err,err.code)
    if(err.errno === -2)
      return res.status(404).send("File not found");
    res.status(500).send("Internal Server Error")
  }

})

app.use(function (req, res) {
  res.status(404).send('Route not found')
})




// app.listen(3000, function () {
//   console.log("started")
// })

module.exports = app;
