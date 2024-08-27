const express = require('express')
const app = express() // To open the server write in the terminal: node app.js

app.use(express.static('public'))
app.listen(88) //To run it - http://localhost:88