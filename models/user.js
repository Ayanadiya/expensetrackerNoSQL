const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isPremium:{
        type:Boolean,
        default:false,
        required:true
    },
    totalExpense:{
        type:Number,
        default:0,
        required:true
    }
})

module.exports=mongoose.model('User', userSchema);