const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
   fname : {
     type:String,
     required : true,
     trim : true
   },
   lname : {
    type:String,
    required : true,
    trim : true
  },
  email : {
    type:String,
    required : true,
    unique : true,
    validate : ((value)=>{
        if(!validator.isEmail(value)){
           throw new Error("Invalid email")
        }
    })
  },
  mobile : {
    type:String,
    required : true,
    trim : true,
  },
  messages : [
    
  ]
},{timestamps:true})

userSchema.methods.Messagesave =async function(message){
     this.messages = this.messages.concat({message})
     await this.save()
     return message;
}

const userDb = new mongoose.model("users",userSchema)
module.exports = userDb;