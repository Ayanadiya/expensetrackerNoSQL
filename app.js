const express = require('express');
const bodyParser= require('body-parser');
const path=require('path');
const mongoose=require('mongoose');

require('dotenv').config();

const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const purchaseRouter=require('./routes/purchase');
const premiumRouter=require('./routes/premium');
const passwordRouter=require('./routes/password');

const app=express();

app.use(bodyParser.json({ extended: false }));
app.use('/dom',express.static(path.join(__dirname, 'dom')));

app.use('/user', userRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/premium', premiumRouter);
app.use('/password', passwordRouter);
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