var mysql = require("mysql");

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
     console.log('Connectoins Failed!')
});
module.exports = con;
