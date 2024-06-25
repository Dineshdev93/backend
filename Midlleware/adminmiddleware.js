const userDb = require("../models/AdminSchema");
const PRIVATE_KEY = "whd%$DS@!@DSF%*dfl"
const jwt = require("jsonwebtoken")

const adminauth = async(req,res,next)=>{
      
    try {
      const token = req.headers.authorization;

      const validuser = jwt.verify(token,PRIVATE_KEY) 

      const rootuser = await userDb.findOne({_id:validuser._id})
      if(!rootuser){
        throw new Error("User not found")
      }

      req.token = token;  // rootuser token
      req.rootuser = rootuser;  // this  is rootuser
      req.userid = rootuser._id;  // simply we can get id in object
    next()
    } catch (error) {
      res.status(400).json({status:400,error})
    }
}

module.exports = adminauth;