import React, { useEffect, useState } from "react";
import image from '../assets/virus_icon.png'
import { Link, useNavigate } from "react-router-dom";
import { login, logout } from '../redux/constants';
import { useSelector } from 'react-redux';
import store from "../redux/store";


const Navbar = ()=>{
  const [token,setToken] = useState(localStorage.getItem("token"))
  const user = useSelector((state)=>state.isLogged)
  const role = useSelector((state)=>state.role)


  useEffect(()=>{
     setToken(localStorage.getItem("token"))
  },[user,role])
    return(

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" >
        <div class="container-fluid" >
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTogglerDemo01" >
            <a class="navbar-brand" href="#"><img src={image} height={40} width={40} ></img></a>
            {
              role == "admin" ? <>
              <ul class="navbar-nav me-auto mb-2 mb-lg-0" >
              
              <li class="nav-item">
              <Link to="/home" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">Students</a></Link>
              </li>
              <li class="nav-item">
              <Link to="/faculty" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">Faculty</a></Link>
              </li>
              <li class="nav-item">
              <Link to="/temperature" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">Temperature</a></Link>

              </li>
              <li class="nav-item">
                <Link to="/pcr" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">PCR</a></Link>
              </li> 
             
            </ul>
            <ul className="navbar-nav navbar-right">
              {
                token ? <li class="nav-item">
                <Link to="/" className="text-decoration-none" onClick={()=>{
                  console.log("logout")
                  setToken(null)
                  localStorage.clear() 
                  store.dispatch(logout(false))
                  
                }}  ><a class="nav-link active " oaria-current="page" href="#">Logout</a></Link>
              </li>: <li class="nav-item">
                
              </li>
              }
            
            </ul>
            </> :
            <>
               <ul class="navbar-nav me-auto mb-2 mb-lg-0" >
              
               <li class="nav-item">
               <Link to="/addPCr" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">PCR</a></Link>
               </li>
               </ul>
               <ul className="navbar-nav navbar-right">
               {
                 token ? <li class="nav-item">
                 <Link to="/" className="text-decoration-none" onClick={()=>{
                   console.log("logout")
                   setToken(null)
                   localStorage.clear() 
                   store.dispatch(logout(false))
                   
                 }}  ><a class="nav-link active " oaria-current="page" href="#">Logout</a></Link>
               </li>: <li class="nav-item">
                 
               </li>
               }
             
             </ul>
             </>
            }
            
          </div>
        </div>
      </nav>
    )
}

export default Navbar