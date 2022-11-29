const express = require('express');
const app = express();
const env = require('dotenv'); //to store constant variables in environment file
const cors = require('cors'); //to prevent cors policy error
const db = require('./db');//first call the database file
const router = require('./routes/mapRoute');
//lets connect the mysql database connection
//to call env file
env.config();
db

const port = process.env.PORT || 2000 //let store port in env file , to call the env varialable, use process.env.varaible

app.use(express.json());
app.use(cors())

//call the route 
app.use('/api',router)



//listen to port 2000
app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})
