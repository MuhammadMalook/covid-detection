const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const passport = require('passport')
require('./userAuth')(passport)



//const upload = require('express-fileupload')

app.use(passport.initialize());

const connection = require('../server')


app.get('/check', passport.authenticate('adminAuth',{ session: false }), (req,res)=>{
    console.log("heree")
    return res.status(200).json({success:true, msg:"logged in"})
})

app.post('/login', async(req, res)=>{
    const {email, password, role} = req.body
    if(!email || !password || !role)
        return res.status(401).json({success:false, msg:"please enter full data"})

    if(role == "admin") {
        connection.con.query(`SELECT * from admin where email='${email}'`,function (error, results, fields) {
            if (error) return res.status(400).json({error:error}) ;
            console.log(results[0].password)
            if(results.length > 0){
                if(results[0].password == password)
                {
                    const token =  jwt.sign({email},process.env.JWT_SECRET, {
                        algorithm:'HS256',
                        expiresIn:'1h'
                    })
                    return res.status(200).json({success:true, data:results, message:"logged in", token})
                }
                    
                else
                    return res.status(200).json({msg:"incorrect password"})
                    
            }
            else{
            return res.status(200).json({msg:"incorrect email"})
            }
            }) 
    }
    else if(role=="faculty"){
            connection.con.query(`SELECT * from admin where email='${email}'`,function (error, results, fields) {
                if (error) return res.status(400).json({error:error}) ;
                console.log(results[0].password)
                if(results.length > 0){
                    if(results[0].password == password)
                    {
                        const token =  jwt.sign({email},process.env.JWT_SECRET, {
                            algorithm:'HS256',
                            expiresIn:'1h'
                        })
                        return res.status(200).json({success:true, data:results, message:"logged in", token})
                    }
                        
                    else
                        return res.status(200).json({msg:"incorrect password"})
                        
                }
                else{
                return res.status(200).json({msg:"incorrect email"})
                }
                }) 
    }



})

app.get('/student',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT * from student", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:false, message:"no record found"})

    })
  })

  app.get('/faculty',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT * from faculty", function(error, results, fields){
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

  app.post("/students-temp",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
   
    const {TAGID, BodyTemp} = req.body
    console.log(new Date().toLocaleDateString(), " Time", new Date().toLocaleTimeString())
    const Test_Date = new Date().toLocaleDateString()
    const Test_Time = new Date().toLocaleTimeString()
    const post = {BodyTemp, Test_Date, Test_Time, TAGID}
    if(!TAGID || !BodyTemp || !Test_Date || !Test_Time)
        return res.status(400).json({success:false, message:"Please enter complete data"})
    connection.con.query('INSERT INTO temperature SET ?', post,
    function(error,results, fields){
        if(error) return res.status(400).json({success:false,message:error})
       
        return res.status(200).json({success:true, data:results})
    }) 
  }      
  )

app.get('/students-temp',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT * from student join temperature using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })

  app.get('/faculty-temp',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT * from faculty join temperature using(TAGID)", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:true,data:[], message:"no record found"})

    })
  })  


module.exports = app