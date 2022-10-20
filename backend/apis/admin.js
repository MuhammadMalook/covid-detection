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
    const {email, password} = req.body
    if(!email || !password)
        return res.status(401).json({success:false, msg:"please enter full data"})

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


})

app.get('/users',passport.authenticate('adminAuth',{ session: false }) ,async(req, res)=>{
    
    console.log("after verify")
    connection.con.query("SELECT * from users", function(error, results, fields){
        if(error) return res.status(400).json({success:false,message:error})
        if(results.length > 0)
        return res.status(200).json({success:true, data:results})
        else
        return res.status(200).json({success:false, message:"no record found"})

    })
  })
  app.post("/addUser",passport.authenticate('adminAuth', {session:false}), async(req, res, next)=>{
   
    const {TAGID, name, email, password, college} = req.body
    const post = {name, email, password, college, TAGID}
    if(!TAGID || !name || !email || !password || !college)
        return res.status(400).json({success:false, message:"Please enter complete data"})
    connection.con.query('INSERT INTO users SET ?', post,
    function(error,results, fields){
        if(error) return res.status(400).json({success:false,message:error})
       
        return res.status(200).json({success:true, data:results})
    }) 
  }      
  )



module.exports = app