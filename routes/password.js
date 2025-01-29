const express= require('express');

const router=express.Router();

const passwordController=require('../controller/password');

router.get('/', passwordController.getForm);

router.post('/forgotpassword', passwordController.getPassword);

router.get('/resetpassword/:id', passwordController.resetPassword);

router.post('/updatepassword', passwordController.updatePassword);

module.exports=router;