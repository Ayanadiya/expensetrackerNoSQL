const express = require('express');

const router= express.Router();

const purchaseController=require('../controller/purchase');

const authenticate = require('../middleware/auth');

router.get('/premiummembership', authenticate.authenticate, purchaseController.purchasePremium );

router.post('/updatetransactionstatus', authenticate.authenticate, purchaseController.updateTransactionStatus);

module.exports= router;