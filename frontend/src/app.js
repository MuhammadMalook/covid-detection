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




export default function App() {
  return (
    <>
    <Router>  
    <Navbar/>
    <Routes>
        <Route path = '/home' element={<Home/>}/>
        <Route index path="/" element={<Login/>}/>
        <Route path='/register' element={<Register/>}/> 
        <Route path='/adduser' element={<AddUser/>}/> 
        </Routes>
    </Router>
    
    </>
  )
}
