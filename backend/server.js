var mysql = require('mysql');
const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json())
app.use(require('./apis/admin'))
app.use('/uploads', express.static("./uploads"))

port = process.env.PORT || 3000;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"covid"
});

con.connect(function(err) {
  if (err) throw err
  console.log("Connected!")
})
app.listen(port);

console.log('API server started on: ' + port);

exports.con = con