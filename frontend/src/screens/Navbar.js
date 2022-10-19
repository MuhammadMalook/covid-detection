import React from "react";
import image from '../assets/virus_icon.png'
import { Link } from "react-router-dom";

const Navbar = ()=>{
    return(
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" >
        <div class="container-fluid" >
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTogglerDemo01" >
            <a class="navbar-brand" href="#"><img src={image} height={40} width={40} ></img></a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0" >
              <li class="nav-item">
              <Link to="/home" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">Students</a></Link>
              </li>
              <li class="nav-item">
              <Link to="#" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">Temperature</a></Link>

              </li>
              <li class="nav-item">
                <Link to="#" className="text-decoration-none"><a class="nav-link active " aria-current="page" href="#">PCR</a></Link>
              </li> 
             
            </ul>
            <ul className="navbar-nav navbar-right">
            <li class="nav-item">
                <Link to="#" className="text-decoration-none" ><a class="nav-link active " aria-current="page" href="#">Logout</a></Link>
              </li>
            </ul>
            
          </div>
        </div>
      </nav>
    )
}

export default Navbar