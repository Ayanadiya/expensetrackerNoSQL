const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const downloadSchema= new Schema({
    date:{
        type:Date,
        required:true
    },
    links:{
        type:String,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

module.exports=mongoose.model('Download', downloadSchema);