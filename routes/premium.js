 const express=require('express');

 const router=express.Router();

 const premiumController=require('../controller/premium');
 const authenticate = require('../middleware/auth');

 router.get('/leaderboard', premiumController.getleaderboard);

 router.get('/download',authenticate.authenticate, premiumController.getDownload);

 router.get('/downloadedfiles', authenticate.authenticate, premiumController.getdownloadedfiles)


 module.exports=router;