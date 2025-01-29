const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User= require('../models/user');
const mongoose=require('mongoose');

require('dotenv').config();
const id=process.env.RAZORPAY_KEY;
const secret=process.env.RAZORPAY_KEYSECRET;

exports.purchasePremium = async (req,res) => {
    try {
        console.log('creating rzp');
        var rzp= new Razorpay({
            key_id:id,
            key_secret:secret
        })
        const amount=50.00*100;
        console.log("amount added");
        rzp.orders.create({amount, currency:"INR"}, (err, order) => {
            if(err)
            {
                console.log(JSON.stringify(err));
                throw new Error(JSON.stringify(err));
            }
            const orders=new Order({
                orderid:order.id,
                status:"Pending",
                userId:req.user
            })
            orders.save()
            .then(()=>{
                console.log("sending order and keyid");
                return res.status(201).json({order, key_id:rzp.key_id});
            })
            .catch(err => {throw new Error(err)})
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({message:'Something went wrong', err:error});
    }
}

exports.updateTransactionStatus = async (req,res) => {
    try {
        console.log('request recieved on updatestatus');
        const {payment_id, order_id,status} = req.body
        await Order.findOneAndUpdate(
            {orderid:order_id},
            { $set: { paymentid: payment_id, status: status === 'success' ? 'successful' : 'failed' } }
        );
        if(status="success"){
            let user= await User.findById(req.user._id);
            user.isPremium=true;
            await user.save();
        }
        return res.status(202).json({success:true, message:status === 'failed' ? 'Payment failed' :"Transaction Successfull"})
    } catch (error) {
        console.log(error);
        res.status(403).json({error:error, message:'Something went wrong'});
    }
}
