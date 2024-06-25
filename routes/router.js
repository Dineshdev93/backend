const express = require("express");
const router = express();
const userDb = require("../models/userSchema");
const nodemailer = require("nodemailer");
const adminDb = require("../models/AdminSchema");
const bcrypt = require("bcryptjs");
const admiauth = require('../Midlleware/adminmiddleware');
const adminauth = require("../Midlleware/adminmiddleware");
// download resume api
router.get("/resume", (req, res) => {
  res.download("./resume.pdf");
});

// nodemialer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

router.post("/post", async (req, res) => {
  const { fname, lname, email, mobile, message } = req.body;
  if (!fname || !lname || !email || !mobile || !message) {
    res.status(401).json({ error: "All fields are required !" });
  }
  try {
    const preuser = await userDb.findOne({ email: email });
    if (preuser) {
      const msg = await preuser.Messagesave(message);
      const mailoptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Your response has been submitted successfully, Mr. ${fname}`,
        text: ` Hey  ${fname} ! 

        I hope , you did sharply examine my portfolio.I am looking for a MERN stack developer job.
         
        If I got opportunity,I will polish my skills under your professional team and uncovered further future scope. 
        
        Thanks once again for your response ☺.
         `
      };
      transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
          console.log(`error-${error}`);
        } else {
          console.log("Email sent", info.response);
          res.status(200).json({ status: 200, msg: "Email sent successfully" });
        }
      });
    } else {
      const userdata = new userDb({
        fname,
        lname,
        email,
        mobile,
        messages: { message },
      });
      const result = await userdata.save();

      // send email config
      const mailoptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Your response has been submitted successfully, Mr. ${fname}`,
        text: ` Hey  ${fname} ! 

        I hope , you did sharply examine my portfolio.I am looking for a MERN stack developer job.

        If I got opportunity,I will polish my skills under your professional team and uncovered further future scope. 
        
        Thanks once again for your response ☺.
         `
      };
      transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
          console.log(`error-${error}`);
        } else {
          console.log("Email sent", info.response);
          res.status(200).json({ status: 200, msg: "Email sent successfully" });
        }
      });

      res.status(200).json({ status: 200, result });
    }
  } catch (error) {
    res.status(401).json(error);
  }
});

router.get("/getall", async (req, res) => {
  try {
    const response = await userDb.find();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getone/:id", async (req, res) => {
  const { id } = req.params;
  const result = await userDb.findOne({ _id: id });
  res.status(200).json(result);
});

// admin register api

router.post("/adminregister", async (req, res) => {
  const { fname, email, password } = req.body;
  if (!fname || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
  }
  try {
    const preuser = await adminDb.findOne({ email: email });
    if (preuser) {
      res.status(400).json({ status: 400, error: "User already exist" });
    } else {
      const admindata = new adminDb({
        fname,
        email,
        password,
      });
      const result = await admindata.save();
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

// admin loginapi

router.post("/login_admin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "All fileds are required" });
  }
  const validuser = await adminDb.findOne({ email: email });
  try {
    if (validuser) {
      const ismatch = await bcrypt.compare(password, validuser.password);

      if (validuser.email !== email) {
        res.status(401).json({ status: 401, error: "Invalid email" });
      } else if (!ismatch) {
        res.status(400).json({ status: 400, error: "Invalid password" });
      } else {
        const admin_tokens = await validuser.generatetoken();
        res.status(200).json({ validuser, admin_tokens });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// get logged admindata
router.get("/getadmin_data",adminauth, async (req, res) => {
  try {
    const result = await adminDb.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

module.exports = router;
