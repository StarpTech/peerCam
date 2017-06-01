const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const port = 8000

// get Node Server instance when calling app.listen
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// parse application/json 
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '..', 'client')))
