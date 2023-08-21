var mysql = require("mysql");

// here con means connection. It's just short form
var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Uncharted4.",
    database:"hms",
    multipleStatements : true
});
mysql.createConnection((err)=>{
    if(!err)
    console.log('Connections Established Successfully');
     else
     console.log('Connections Failed!');
});
module.exports = con;
