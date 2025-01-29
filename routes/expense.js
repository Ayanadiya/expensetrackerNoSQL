const express = require('express');

const router= express.Router();

const expenseController = require('../controller/expenses');
const authenticate = require('../middleware/auth');

router.get('/', expenseController.getexpensepage);

router.get('/premium', expenseController.getpremiumexpensepage);

router.post('/addexpense',authenticate.authenticate, expenseController.postdailyexpense);

router.get('/getexpense',authenticate.authenticate, expenseController.getExpenses);

router.delete('/delete/:id', expenseController.deleteexpense);

module.exports=router;