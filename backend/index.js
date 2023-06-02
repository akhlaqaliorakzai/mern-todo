const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");

const Todo = require("./model/todo")

mongoose.connect("mongodb://localhost:27017/todo",{useNewUrlParser:"true"});

//adding item to database
app.post("/api/add-item", async (req, res)=>{
    const item = req.body.item;
    const searchItem = await Todo.findOne({content : item});
    const date = new Date().toLocaleString();
    if(searchItem){
        res.status(400).json({error: "Todo item already exists..."})
    }
    else{
        Todo.create({
            content: item,
            date: date,
            completed: false,
        })
        res.status(200).json({message:"Item Successfully saved..."})
    }

})

//sending all todo items to frontend
app.get("/api/get-items", async (req, res)=>{
   
    const items = await Todo.find();
    if(items.length>0){
        res.json({status:"ok", items: items})
    }
    else{
        res.status(400).json({error:"Data does not exists..."})
    }

})

//deleteing a todo item
app.post("/api/delete-item", async (req, res)=>{
    const item = req.body.item;
    const searchItem = await Todo.deleteOne({content : item});
    if(searchItem){
        res.status(200).json({message: "Item Deleted Successfully..."})
    }
    else{
        res.status(200).json({message:"Operation failed..."})
    }

})

//completeing the todo item
app.post("/api/tick-item", async (req, res)=>{
    const item = req.body.item.content;
    const searchItem = await Todo.updateOne({content : item},{$set:{completed:true}});
    if(searchItem){
        res.status(200).json({message: "Item Deleted Successfully..."})
    }
    else{
        res.status(200).json({message:"Operation failed..."})
    }

})

//editing the todo item
app.post("/api/edit-item", async (req, res)=>{
    const item = req.body.item;
    const updatedItem = req.body.updatedItem;
    const date = new Date().toLocaleString();
    const isAvailable = await Todo.findOne({content:updatedItem})
    let searchItem = null;
    if(!isAvailable){
        searchItem = await Todo.updateOne({content : item},{$set:{content:updatedItem, date: date }});
    }
    
    if(searchItem && !isAvailable){
        res.status(200).json({message: "Item Deleted Successfully..."})
    }
    else{
        res.status(400).json({message:"Operation failed..."})
    }

})
//listening on port 1337
app.listen(1337, ()=>{
    console.log("Server started on 1337...")
})