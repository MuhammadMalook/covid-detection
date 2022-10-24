import React, { useEffect, useState } from 'react'
import { Formik, Form,ErrorMessage, Field } from 'formik'
import TextField from './TextField'
import * as Yup from 'yup';

export default function AddUser() {

  const [imageUrl, setImageUrl] = useState()
  const [token,setToken] = useState(localStorage.getItem("token"))

  const validate = Yup.object({
    TAGID : Yup.string()
      .max(50, 'Must be 50 characters or less')
      .required('Tag ID is Required'),
    name: Yup.string()
      .max(100, 'Must be 100 characters or less')
      .required('Name is Required'),
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 charaters')
      .required('Password is required'),
    college: Yup.string()
      .max(100,'college is invalid')
      .required('college is required'),
   
  })


  return (
    <Formik
    initialValues={{
      TAGID:'',
      name: '',
      email: '',
      password: '',
      college: '',
      role:'',

    }}
    validationSchema={validate}
    onSubmit={async(values) => {
      let data = new FormData()
      data.append("TAGID", values.TAGID)
      data.append("name", values.name)
      data.append("email", values.email)
      data.append("password", values.password)
      data.append("college", values.college)
      //data.append("admin_email", "malook@gmail.com")
     

      console.log( data.entries)

      const body = {name:values.name, email:values.email, password:values.password, college:values.college, TAGID:values.TAGID, role:values.role }
      var auth = "Bearer ".concat(JSON.parse(token))
      console.log(auth)
      const response = await fetch('/addUser', {
        method:"POST",
        headers:{
           'Content-type': 'application/json',
           "Authorization": auth,

        },
        body: JSON.stringify(body)
      })
      const jsonData = await response.json()
      if(jsonData.success)
      {
        alert("Added successfully")
        navigate('/home')
      }
      else{
        alert("error occured ", jsonData.msg)
      }
    }}
  >
    {formik => (
      <div className="container mt-3">
      <div className="row">
        <div className="col-md-12 col-sm-12">
            <div>
                <h1 className="my-4 font-weight-bold .display-4">Add Student</h1>
             
                <Form>
                  <TextField label="Tag ID" name="TAGID" type="text" />    

                  <TextField label="Full Name" name="name" type="text" />    
                  <TextField label="Email" name="email" type="email" />
                  <TextField label="Password" name="password" type="password" />
                  <TextField label="College" name="college" type="college" />
                  <div className="mb-2">
              
            </div>
            <div role="group" aria-labelledby="my-radio-group" style={{display:'flex',justifyContent:'space-around', marginTop:30}} className="col-md-12 col-sm-8">
              <label>
                <Field type="radio" name="role" value="faculty" />
                Faculty
              </label>
              <label>
                <Field type="radio" name="role" value="student" />
                  Student
              </label>
             
          </div>
            
                  <button className="btn btn-dark mt-3" type="submit">ADD PERSON</button>
                  <button className="btn btn-danger mt-3" type="reset" style={{marginLeft:20}}>Reset</button>   
                </Form>
                
  
              
            </div>
        </div>
      </div>
    </div>
      
    )}
  </Formik>
  )
}
