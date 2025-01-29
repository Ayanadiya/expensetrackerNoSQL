const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const passwordSchema=new Schema({
    uuid:{
        type:String,
        unique:true
    },
    active:{
        type:Boolean,
    },
    expiredby:{
        type:Date,
    }
}
)

module.exports=mongoose.model('Password', passwordSchema);