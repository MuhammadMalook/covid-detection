import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import TextField from './TextField'
import * as Yup from 'yup';
import image from '../assets/covid_icon.png';
import {Link} from 'react-router-dom'
import '../assets/Login.css'
import { useNavigate } from 'react-router-dom';
import store from '../redux/store';
import { login, logout } from '../redux/constants';
import { useSelector } from 'react-redux';


function Login() {
  const [api, setApi] = useState(true)
  const role = useSelector((state)=>state.role)

  const checkToken = async() => {
    console.log("checccccckkllk")
    setApi(false)
    var token =  localStorage.getItem('token')
    
   if(token){
    console.log(token)
    var auth = "Bearer ".concat(JSON.parse(token))
    console.log(auth)

    const response = await fetch('/check', {
        method:"GET",
        headers:{
             Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": auth,
        },
    })
    console.log(response)
   if(response.statusText == "Unauthorized")
   {
            console.log("heeereree")
            localStorage.clear()
            navigate('/')
         
   }
   else{
    const jsonData = await response.json()
    console.log(jsonData)
    console.log(jsonData,"jsonDAta")
    setApi(false)
    if(jsonData.success)
    {
      if(role == "admin")
        navigate('/home')
      else
        navigate('/addPcr')
    }
    else {
        localStorage.clear()
        navigate('/')
       

    }
  }
}
  else{
setApi(true)
  }
}
  useEffect(()=>{
    
    checkToken()
  },[])

  const navigate  = useNavigate()

  const validate = Yup.object({
   
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 charaters')
      .required('Password is required')
  })

  return (
    <Formik
    initialValues={{
      email: '',
      password: '',
      role: '',
    }}
    validationSchema={validate}
    onSubmit={async(values) => {
      const body = {email:values.email, password:values.password, role:values.role }
      console.log(values)
      const response = await fetch('/login', {
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify(body)
      })
      const jsonData = await response.json()
      console.log(jsonData, "datatatatatat")
      if(jsonData.success)
      {
        alert("loged in successfully")
        
        localStorage.setItem("token", JSON.stringify(jsonData.token))
       
        console.log(localStorage.getItem("token"))
        store.dispatch(login(values.role))
        if(values.role == "admin")
          navigate('/home')
        else{
          navigate('/addPcr')
        }
      }
      else{
        alert("error occured")
      }
    }}
  >
    {api ?  formik => (
      <div className="container-login mt-3">
      <div className="row ">
        <div className="col-md-7 my-auto">
          <div className='col-md-8'>
            <img className="img-fluid w-75 h-50 ms-5" src={image} alt=""/>
          </div>
        </div>
        <div className="col-md-5">
          <div>
            <h1 className="my-4 font-weight-bold .display-4">Log in</h1>
            <Form>
              
              <TextField label="Email" name="email" type="email" />
              <TextField label="password" name="password" type="password" />

            <div role="group" aria-labelledby="my-radio-group" style={{display:'flex',justifyContent:'space-around', marginTop:30}} className="col-md-6 col-sm-8">
              <label>
                <Field type="radio" name="role" value="admin" />
                Admin
              </label>
              <label>
                <Field type="radio" name="role" value="faculty" />
                Faculty
              </label>
              <label>
                <Field type="radio" name="role" value="student" />
                  Student
              </label>
             
          </div>

              <button className="btn btn-dark mt-3" type="submit">Login</button>
              <button className="btn btn-danger mt-3" type="reset" style={{marginLeft:20}}>Reset</button>
            </Form>
        {/* <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="admin"/>
              <label class="form-check-label" for="inlineRadio1">Admin</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
              <label class="form-check-label" for="inlineRadio2">2</label>
      </div> */}
            <div style={{marginTop:"15px"}}>don't have an account? <Link to="/register">sign up</Link></div>
          </div>
        </div>
      </div>
    </div>
      
    ) : <p>loading...</p>}
  </Formik>
  )
}

export default Login