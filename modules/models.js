const mongoose=require('mongoose');
const reminderSchema=new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ["pending","sent"],
        default: "pending"
        
    },
    priority:{
        type: String,
        enum: ["mild","low","high"],
        default: "low"
    }
});

const REMINDER=mongoose.model("REMINDER",reminderSchema);

module.exports={
    REMINDER
}