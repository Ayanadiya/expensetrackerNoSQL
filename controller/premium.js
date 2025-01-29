
const Expense=require('../models/expense');
const User=require('../models/user');
const Download=require('../models/download');

const AWS= require('aws-sdk');

require('dotenv').config();


exports.getleaderboard = async (req,res,next) => {
    try {
          const leaderboard= await User.find()
          .select('name totalExpense')
          .sort({totaExpense:-1}); // to sort in descending order
          console.log(leaderboard);
          res.status(200).json(leaderboard);
        }

    catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

exports.getDownload= async (req,res,next) => {
    try {
        if(req.user.isPremium===false)
        {
            return res.status(401).json({message:'Not a premium user'});
        }
        const id=req.user._id;
        const expenses= await Expense.find({userId:id});
        const stringifyexpenses= JSON.stringify(expenses);
        const Filename=`expenses${id}/${new Date()}.txt`;
        const fileURL= await uploadtoS3(stringifyexpenses,Filename);
        const download= new Download({date:new Date(), links:fileURL, userId:id});
        await download.save();
        console.log(fileURL);
        res.status(200).json({fileURL,success:true});

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

function uploadtoS3(data,filename) {
    const BUCKET_NAME=process.env.BUCKETNAME
    const IAM_USER_KEY=process.env.AWSACCESSKEY
    const IAM_USER_SECRET=process.env.AWSSECRETKEY

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })
    var params= {
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read',
        ContentType: 'text/plain',
        ContentDisposition: 'attachment; filename="' + filename + '"'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                reject(err);  // Reject the promise if there's an error
            } else {
                resolve(s3response.Location);  // Resolve the promise with the file URL
            }
        });
    });
}

exports.getdownloadedfiles = async (req,res,next) => {
    try {
        console.log('reached backend');
        const id =req.user._id;
        const downloads=await Download.find({userId:id});
        console.log(downloads);
        res.status(200).json(downloads);
    } catch (error) {
        console.log(error);
        res.status(500).json('Something went wrong', {error:error});
    }
}