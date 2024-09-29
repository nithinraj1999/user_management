const express = require("express")
const mongoose = require("mongoose")
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/myDataB")


const studentSchema = new mongoose.Schema({
    name:String,
    age:Number,
    degree:String
})
const student = mongoose.model("student",studentSchema)

const stu = new student({
    name:"nithin",
    age:24,
    degree:"Bcom"
});
stu.save().then(()=>console.log("One entry Added"),(err)=>console.log(err))




app.get("/",(req,res)=>{ 
    const found = student.find({},function (err,found){
        if(err) throw err;
    })
    const json = JSON.stringify(found);
        res.send(json)
    })
   



app.listen(3000,()=>{console.log("running...")})
