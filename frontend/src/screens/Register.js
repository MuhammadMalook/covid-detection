import React from 'react'
import { Formik, Form } from 'formik'
import TextField from './TextField'
import * as Yup from 'yup';
import image from '../assets/logo.png';
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate()

    const validate = Yup.object({
        fullname: Yup.string()
          .max(30, 'Must be 30 characters or less')
          .required('Required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 charaters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Password must match')
          .required('Confirm password is required'),
      })
    
  return (
    <Formik
    initialValues={{
      fullname: '',
      email: '',
      password: '',
      confirmPassword: ''
    }}
    validationSchema={validate}
    onSubmit={async(values) => {
      const body = {fullname:values.fullname, email:values.email, password:values.password, imageUrl:"" }
      console.log(body)
      const response = await fetch('/register', {
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify(body)
      })
      const jsonData = await response.json()
      if(jsonData.success)
      {
        alert("Registered successfully")
        navigate('/login')
      }
      else{
        alert("error occured ", jsonData.msg)
      }
    }}
  >
    {formik => (
      <div className="container mt-3">
      <div className="row">
        <div className="col-md-7 my-auto">
          <div className='col-md-8'>
            <img className="img-fluid w-75 h-50 ms-5" src={image} alt=""/>
          </div>
        </div>
        <div className="col-md-5">
            <div>
                <h1 className="my-4 font-weight-bold .display-4">Sign Up</h1>
                <Form >
                  <TextField label="Full Name" name="fullname" type="text" />    
                  <TextField label="Email" name="email" type="email" />
                  <TextField label="password" name="password" type="password" />
                  <TextField label="Confirm Password" name="confirmPassword" type="password" />
                  <button className="btn btn-dark mt-3" type="submit">Register</button>
                  <button className="btn btn-danger mt-3" type="reset" style={{marginLeft:20}}>Reset</button>
                  
                </Form>
                <div style={{marginTop:"15px",}}>already have an account? <Link to="/login">sign in</Link></div>
            </div>
        </div>
      </div>
    </div>
      
    )}
  </Formik>
  )
}

export default Register