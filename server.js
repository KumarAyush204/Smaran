const express= require('express');
const app=express();
const ejs=require('ejs');
const mongoose=require('mongoose');
const models=require('./modules/models');
const { mini } = require('./modules/mini.js');
const {DateTime}=require('luxon');
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/Smaran");

//Index Page
app.get("/",function(req,res){
    return res.render('index');
});

//Call Api & Handle response
app.post("/callMini",async function(req,res){
//    var user_content="set reminder for next tuesday monday that i have to go ISKON temple at 7am. todays date is 08/08/25. based on above return only one or multiple json response in reply of the format: { title: //give a title, description: //give a desription, date: //set dates based on above information in ISO format 'yy-mm-ddTh:m:sZ'}";
        var date=DateTime.now().toLocaleString(DateTime.DATETIME_MED);
        console.log(date);
    var user_content= req.body.user_content+"todays date and time is"+date+"based on above return only one or multiple json response in reply of the format: { title: //give a title, description: //give a desription, date: //set dates based on above information in ISO format 'yy-mm-ddTh:m:sZ'}";
    console.log(user_content);
    

    const repl=await mini(user_content).catch((err) => {
  console.error("The sample encountered an error:", err);
});
    console.log(repl);
    const obj=JSON.parse(repl);
    for (let i=0;i<obj.length;i++){
        console.log(obj[i]);
        const reminder = new models.REMINDER(obj[i]);
        reminder.save();
    }
    return res.send("reply");
});

app.get("/reminders",async function (req,res){
   const reminders=await models.REMINDER.find({});
   res.render("reminders",{reminders:reminders}); 
});

app.get("/priortize",async function (req,res){
    const reminders=await models.REMINDER.find({});
    //Priortize reminders with openai + date required.
//    var user_content=reminders+"use the above reminders and decide priority of reminders; decide priority based on date and time ;['mild','low','high'] return three arrays one having reminder ids that are high, second that are mild and thrif of low priority. **Only return arrays nothing else!!**";
    
    var user_content="You are given reminders in JSON format:"+reminders+`Task:1. Decide the priority of each reminder based on its date and time. 
   - "high" = reminders due very soon or overdue
   - "mild" = reminders due within a moderate time range
   - "low" = reminders scheduled far in the future
    2. Return exactly three arrays (no text, no explanation):
       - First array = IDs of reminders with "high" priority
       - Second array = IDs of reminders with "mild" priority
       - Third array = IDs of reminders with "low" priority

    Output format (strictly):
    [
      ["id1","id2"],
      ["id3"],
      ["id4","id5"]
    ]`;
    
    const repl=await mini(user_content).catch((err) => {
  console.error("The sample encountered an error:", err);
});
    console.log(repl);
    const obj=JSON.parse(repl);
    for(let i=0;i<obj.length;i++){
        for(let j=0;j<obj[i].length;j++){
            if (i==0){
                await models.REMINDER.findOneAndUpdate({_id:obj[i][j]},{$set:{priority:"high"}});
            }
            else if (i==1){
                await models.REMINDER.findOneAndUpdate({_id:obj[i][j]},{$set:{priority:"mild"}});
            }
            else{
                console.log("Do nothing");
            }
            
        }
    }   
    
    console.log(repl);
    return res.redirect('/reminders');
});

//Checking Server
app.listen(3000,function(){
    console.log("Server Running...");
});