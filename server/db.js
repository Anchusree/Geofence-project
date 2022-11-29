const env = require('dotenv'); //to store constant variables in environment file
env.config();
//call the mysql module
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'maptest',
    port:process.env.MYSQLPORT
})

connection.connect(function(err){
    if(err){
        throw err;
    }
    else{
        console.log('Database Connected Successfully');
    }
})

//to export connection 
module.exports = connection