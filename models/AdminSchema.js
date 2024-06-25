const mongoose = require('mongoose');
const validator = require('validator')
const PRIVATE_KEY = "whd%$DS@!@DSF%*dfl"
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const adminSchema = new mongoose.Schema({
   fname : {
     type : String,
     required : true,
     trim : true
   },
   email : {
     type : String,
     required : true,
     unique : true,
     validate : ((value)=>{
        if(!validator.isEmail(value)){
            throw new Error("Invalid email address")
        }
     })
   },
   password : {
      type :String,
      required : true,
   },
   tokens : [
    {
      token :{
        type :String,
        required:true
      }
    }
   ]
},{timestamps:true})

adminSchema.pre('save',async function(next){
    if(this.isModified("password")){
       this.password =await bcrypt.hash(this.password,10)
    }
    next()
})

 // generate token
  adminSchema.methods.generatetoken = async function(){
      const newtoken = jwt.sign({_id:this._id},PRIVATE_KEY,{expiresIn:"2d"})
      this.tokens = this.tokens.concat({token:newtoken})
      await this.save();
      return newtoken;
  }

const admindb = new mongoose.model("admins",adminSchema)
module.exports = admindb;