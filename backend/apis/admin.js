const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var Mailer = require("nodemailer");

const passport = require('passport')
require('./userAuth')(passport)
const JWT_SECRET = process.env.JWT_SECRET




//const upload = require('express-fileupload')

app.use(passport.initialize());

const connection = require('../server')


app.get('/sendEmail',async(req,res)=>{



})

app.get('/check', passport.authenticate('adminAuth',{ session: false }), (req,res)=>{
    console.log("heree")
    return res.status(200).json({success:true, msg:"logged in"})
})

app.post('/login', async(req, res)=>{
    const {email, password, role} = req.body
    console.log(req.body)
    if(!email || !password || !role)
        return res.status(401).json({success:false, msg:"please enter full data"})

        connection.con.query(`SELECT * from ${role} where email='${email}'`,function (error, results, fields) {
            if (error) return res.status(400).json({error:error}) ;
           // console.log(results[0].password)
            if(results.length > 0){
                if(results[0].password == password)
                {
                    const token =  jwt.sign({email},process.env.JWT_SECRET, {
                        algorithm:'HS256',
                        expiresIn:'1h'
                    })
                    delete results[0].password
                    return res.status(200).json({success:true, data:results, message:"logged in", token})
                }
                    
                else
                    return res.status(200).json({msg:"incorrect password"})
                    
            }
            else{
            return res.status(200).json({msg:"incorrect email"})
            }
            }) 

    // else if(role=="faculty"){
    //         connection.con.query(`SELECT * from facullty where email='${email}'`,function (error, results, fields) {
    //             if (error) return res.status(400).json({error:error}) ;
    //             console.log(results[0].password)
    //             if(results.length > 0){
    //                 if(results[0].password == password)
    //                 {
    //                     const token =  jwt.sign({email},process.env.JWT_SECRET, {
    //                         algorithm:'HS256',
    //                         expiresIn:'1h'
    //                     })
    //                     return res.status(200).json({success:true, data:results, message:"logged in", token})
    //                 }
                        
    //                 else
    //                     return res.status(200).json({msg:"incorrect password"})
                        
    //             }
    //             else{
    //             return res.status(200).json({msg:"incorrect email"})
    //             }
    //             }) 
    //}



})

app.get('/student',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT name, email, college, TAGID from student", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:false, message:"no record found"})

    })
  })

  app.get('/faculty',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT name, email, college, TAGID from faculty", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:false, message:"no record found"})

    })
  })  

  app.post("/addUser",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
   
    const {TAGID, name, email, password, college, role} = req.body
    const register = {TAGID, role}
    const post = {name, email, password, college, TAGID}
    if(!TAGID || !name || !email || !password || !college || !role)
        return res.status(400).json({success:false, message:"Please enter complete data"})
    
        
    connection.con.query('INSERT INTO registration SET ?', register,
    function(error,results, fields){
        if(error) return res.status(400).json({success:false,message:error})
       
        connection.con.query(`INSERT INTO ${role} SET ?`, post,
            function(error,results, fields){
            if(error) return res.status(400).json({success:false,message:error})
            return res.status(200).json({success:true, data:results})
    }) 
  }      
  )
}
)

  app.post("/add-temp",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
   console.log(process.env.EMAIL)
    const {TAGID, BodyTemp} = req.body
   
    console.log(new Date().toLocaleDateString(), " Time", new Date().toLocaleTimeString())
    const Test_Date = new Date().toLocaleDateString()
    const Test_Time = new Date().toLocaleTimeString()
    let PcrStatus = "pending"
    if(BodyTemp > 38)
        PcrStatus = "pending"
    else{
        PcrStatus = "normal"
    }    
    const post = {BodyTemp, Test_Date, Test_Time, TAGID, PcrStatus}
    if(!TAGID || !BodyTemp || !Test_Date || !Test_Time || !PcrStatus)
        return res.status(400).json({success:false, message:"Please enter complete data"})
    connection.con.query('INSERT INTO temperature SET ?', post,
    function(error,results, fields){
        if(error) return res.status(400).json({success:false,message:error})
       
        if(BodyTemp > 38)
        {

            // Initialize the Authentication of Gmail Options
                var transportar = Mailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
                tls:{
                    rejectUnAuthorized:false
                }
                });

                // Deifne mailing options like Sender Email and Receiver.
                var mailOptions = {
                from: process.env.EMAIL, // Sender ID
                to: process.env.EMAIL, // Reciever ID
                subject: "pcr test", // Mail Subject
                html: "<p>Please do your pcr test within 48 hours: You have high temperature</p>", // Description
                };

                // Send an Email
                transportar.sendMail(mailOptions, (error, info) => {
                if (error) console.log(error);
                console.log(info);
                });
        }
        else{
            console.log("body temperature normal")
        }
        return res.status(200).json({success:true, data:results})
    }) 
  }      
  )


  


app.get('/students-temp',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT name, email, college, TAGID, BodyTemp, Test_Date, Test_Time,PcrStatus from student join temperature using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })

  app.get('/faculty-temp',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT name, email, college, TAGID, BodyTemp,Test_Date, Test_Time,PcrStatus  from faculty join temperature using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })  


  app.get('/checkAdmin/:token', async(req, res)=>{
    const {token} = req.params
    console.log("params", req.params)
    try{
        payload = jwt.verify(JSON.parse(token), JWT_SECRET)
        console.log(payload.email, "sdmfsdfs")
        connection.con.query(`SELECT email from admin where email='${payload.email}'`, function(error, results, fields){
            if(error) return res.status(400).json({success:false,message:error})
            if(results.length > 0)
            return res.status(200).json({success:true, data:results, role:"admin"})
            else
            {
                connection.con.query(`SELECT email from student where email='${payload.email}'`, function(error, results, fields){
                    if(error) return res.status(400).json({success:false,message:error})
                    if(results.length > 0)
                    return res.status(200).json({success:true, role:"student"})
                    else
                    {
                        connection.con.query(`SELECT email from faculty where email='${payload.email}'`, function(error, results, fields){
                            if(error) return res.status(400).json({success:false,message:error})
                            if(results.length > 0)
                            return res.status(200).json({success:true, role:"faculty"})
                            else
                            {
                                return res.status(200).json({success:false, msg:"no record found"})
                            }
                        })
                    }
                })
            }
        })

    }
    catch(e){
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).json({success:false, msg:e})
          }
          // otherwise, return a bad request error
          return res.status(400).json({success:false, msg:'wrong token'})
    }
   
    //console.log(payload)
   
  })


  app.get('/students-pcr',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("student-pcr")
    connection.con.query("SELECT name, email, college, TAGID, pcrResult, Test_Status from student join pcrtest using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })

  app.get('/faculty-pcr',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("student-pcr")
    connection.con.query("SELECT name, email, college, TAGID, pcrResult, Test_Status from faculty join pcrtest using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })


  app.post("/add-pcr",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
   
    const {token, pcrResult, role} = req.body
    console.log(new Date().toLocaleDateString(), " Time", new Date().toLocaleTimeString())
    const Test_Date = new Date().toLocaleDateString()
    const Test_Time = new Date().toLocaleTimeString()
    let Test_Status ="normal"
    if(pcrResult == 1)
         Test_Status = "Positive"
    else 
        Test_Status = "Negative"    
    
    if(!token || !Test_Status || !pcrResult )
        return res.status(400).json({success:false, message:"Please enter complete data"})
     
    payload = jwt.verify(JSON.parse(token), JWT_SECRET)   

    connection.con.query(`SELECT TAGID from ${role} where email='${payload.email}'`, function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        {
            const TAGID = results[0].TAGID
            const post = {pcrResult,Test_Status, TAGID}
            connection.con.query('INSERT INTO pcrtest SET ?', post,
            function(error,results, fields){
                if(error) return res.status(400).json({success:false,message:error})
                connection.con.query('UPDATE temperature SET PcrStatus = ? WHERE TAGID = ?', [Test_Status, TAGID], function(error,results,fields){
                            if(error) return res.status(400).json({success:false,message:error})
                            if(pcrResult  == 1)
                            {
                                // Initialize the Authentication of Gmail Options
                                    var transportar = Mailer.createTransport({
                                        host: 'smtp.gmail.com',
                                        port: 587,
                                        secure: false,
                                    auth: {
                                        user: process.env.EMAIL,
                                        pass: process.env.PASSWORD
                                    },
                                    tls:{
                                        rejectUnAuthorized:false
                                    }
                                    });
                                    var maillist = [
                                        'maharmohammadmalook@gmail.com',
                                        'mcza445@gmail.com',
                                    ]
                    
                                    // Deifne mailing options like Sender Email and Receiver.
                                    var mailOptions = {
                                    from: process.env.EMAIL, // Sender ID
                                    to: maillist, // Reciever ID
                                    subject: "pcr test", // Mail Subject
                                    html: "<p>Please do your pcr test within 48 hours because You were with someone who have positive PCR</p>", // Description
                                    };
                    
                                    // Send an Email
                                    transportar.sendMail(mailOptions, (error, info) => {
                                    if (error) console.log(error);
                                    console.log(info);
                                    });
                            }
                            else{
                                console.log("PCR Test is normal")
                            }
                            return res.status(200).json({success:true, msg:"updated"})
                        })
            
            
                
            })
        }
        else{
            return res.status(200).json({success:true, data:[], msg:"no record found"})
            }
    })
  }      
  )  
  


app.get("/getMyPcr/:token/:role",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
    const {token, role} = req.params
    console.log(role)
    try{

        payload = jwt.verify(JSON.parse(token), JWT_SECRET)
        console.log(payload)
        connection.con.query(`SELECT TAGID from ${role} where email='${payload.email}'`, function(error, results, fields){
            if(error) return res.status(400).json({success:false,message:error})
            console.log(results[0].TAGID)
            if(results.length > 0)
            {
                connection.con.query(`SELECT PcrStatus from temperature where TAGID='${results[0].TAGID}'`, function(error, results, fields){
                    if(error) return res.status(400).json({success:false,message:error})
                    console.log(results.length-1)
                    if(results.length > 0){
                    if(results[results.length-1].PcrStatus == "pending")
                        return res.status(200).json({success:true, data:true, msg:"Your PcrTest is pending"})
                    else
                    {
                        return res.status(200).json({success:true, data:false, msg:"you don't have pending PcrTest"})
                    }
                    }
                    else{
                        return res.status(400).json({success:true, data:false, msg:"You don't have any entry for temperature"})
                    }
                })
            }
            else{
                return res.status(400).json({success:false, msg:"no record found"})
            }
        })

    }
    catch(e){
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).json({success:false, msg:e})
          }
          // otherwise, return a bad request error
          return res.status(400).json({success:false, msg:'wrong token'})
    }
    
      
})

module.exports = app