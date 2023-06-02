const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Todo = new Schema({
    content:{
        type: String,
        required: true,
    },
    date : {
        type: String,
        required: true,
    },
    completed: {
        type : Boolean,
        required: true,
    }
    
})
const model = mongoose.model("Todo",Todo);
module.exports = model;