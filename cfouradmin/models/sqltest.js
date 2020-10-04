var mysql = require('mysql');

var con = mysql.createConnection({
  host: "108.170.57.51",
  port: "",
  password: "",
  database: "eshoppin_c4projects"
});

module.exports = con