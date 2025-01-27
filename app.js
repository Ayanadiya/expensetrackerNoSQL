const express = require('express');
const bodyParser= require('body-parser');
const path=require('path');
const mongoose=require('mongoose');

require('dotenv').config();

const app=express();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',(req,res) =>{res.sendFile(path.join(__dirname,'views','login.html'))} );

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@expensetracker.upztj.mongodb.net/?retryWrites=true&w=majority&appName=ExpenseTracker`)
.then(result =>{
    console.log("Connected to database");
    app.listen(3000);
})
.catch(error => {
    console.log(error);
})