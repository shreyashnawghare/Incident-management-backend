const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncidentSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    resolved:{
        type:Boolean
    },
    userAssigned:{
        type:String
    }
},
{ timestamps:true }
);

module.exports = mongoose.model("Incident",IncidentSchema);