const mongoose= require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentschema = new mongoose.Schema({
     studentName : {
        type:String,
        required:true
     },
     subject:{
        type:String,
        enum:["Hindi","English","Math"],
        required:true
     },
     marks:{
        type:Number,
        required:true
     },
     userId:{
        type : ObjectId,
        ref:"user",
        required:true

     }
})

module.exports=mongoose.model("marks",studentschema)