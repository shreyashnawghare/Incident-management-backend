const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    incidents:{
type:Array,
required:false
    },
    admin:{
        type:Boolean
    }
},
{ timestamps:true }
);

module.exports = mongoose.model("User",UserSchema);