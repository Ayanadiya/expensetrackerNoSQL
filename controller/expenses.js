const path= require('path');

const Expense=require('../models/expense');
const User=require('../models/user');
const { default: mongoose } = require('mongoose');



exports.getexpensepage = ((req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'expense.html'));
});

exports.getpremiumexpensepage = ((req,res,next) => {
    res.sendFile(path.join(__dirname,'../','views','premiumexpense.html'));
})


exports.postdailyexpense = async (req,res,next) => {
    const session=await mongoose.startSession();
    const amount = req.body.amount;
    const desc = req.body.description;
    const category = req.body.category;
    const userId =req.user._id;


    try{
        session.startTransaction();
        const expense =new Expense ({
            amount:amount,
            description:desc,
            category:category,
            userId:userId
        })
        await expense.save({session});
        const updatedtotalexpense= Number(req.user.totalExpense) +Number(amount);
        await User.findByIdAndUpdate(userId,{totalExpense:updatedtotalexpense}, {session})
        await session.commitTransaction();
        return res.status(200).json(expense);
    }catch(error) {
        await session.abortTransaction();
        console.log(error);
        return res.status(500)
    } finally{
        session.endSession();
    }  
}

exports.getExpenses = async (req,res,next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const totalExpenses = await Expense.countDocuments({ userId: req.user._id } );
        const totalPages = Math.ceil(totalExpenses / limit);

       const expenses=await Expense.find({userId:req.user.id}).skip(offset).limit(limit);
    res.json({ expenses, totalExpenses, totalPages });
    }
    catch(err) {
        res.json(err);
    }
}


exports.deleteexpense= async (req,res,next) => {
    const session= await mongoose.startSession()
    const id=req.params.id;
    try {
        session.startTransaction();
        const expense= await Expense.findById(id).session(session);
        await Expense.findByIdAndDelete(id).session(session);
        const user= await User.findById(expense.userId).session(session);
        const updatedtotalexpense= Number(user.totalExpense) -Number(expense.amount);
        await User.findByIdAndUpdate(expense.userId,{totalExpense:updatedtotalexpense}).session(session);
        await session.commitTransaction();
        res.status(200).json({message:"Expense removed"});
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json(error);
    } finally{
        session.endSession();
    }
    
}

