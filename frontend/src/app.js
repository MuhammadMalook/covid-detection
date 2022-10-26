import React, { useEffect, useState } from 'react'
import Register from './screens/Register'
import "./App.css"
import Navbar from './screens/Navbar'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import Login from './screens/Login';
import Home from './screens/Home';
import AddUser from './screens/AddUser';
import Temperature from './screens/Temperature';
import Faculty from './screens/Faculty';
import AddPcr from './screens/AddPcr';

import { login, logout } from './redux/constants';
import { useSelector } from 'react-redux';
import store from './redux/store';
import PcrTest from './screens/PcrTest';



export default function App() {
  
  
  const checkAdmin = async(token)=>{
    const response = await fetch(`/checkAdmin/${token}`, {
      method:"GET"
    })
    const jsonData = await response.json()
    console.log(jsonData, "json")
    console.log("App.js")
    if(jsonData.success)
    {
      store.dispatch(login(jsonData.role))
    }
    else{
      localStorage.clear()
      
    }
    
    

    
  }

  useEffect(()=>{
    const token = localStorage.getItem("token")
      checkAdmin(token)
  },[])
  return (
    <>
    <Router>  
    <Navbar />
    <Routes>
        <Route path = '/home' element={<Home/>}/>
        <Route path = '/faculty' element={<Faculty/>}/>
        <Route index path="/" element={<Login/>}/>
        <Route path='/register' element={<Register/>}/> 
        <Route path='/adduser' element={<AddUser/>}/> 
        <Route path='/temperature' element={<Temperature/>}/> 
        <Route path='/pcr' element={<PcrTest/>}/> 
        <Route path='/addPcr' element={<AddPcr/>}/> 


        </Routes>
    </Router>
    
    </>
  )
}
