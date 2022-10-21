import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader';
import ClipLoader from "react-spinners/BounceLoader";
import '../assets/home.css'
// import image from '../../../backend/uploads/'
// import image from '../assets/logo.png'

export default function Home() {

    const baseUrl = process.env.REACT_APP_BASE_URL
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [token,setToken] = useState(localStorage.getItem("token"))
    const navigate = useNavigate()

  const checkToken = async() => {
        setLoading(true)
        var auth = "Bearer ".concat(JSON.parse(token))
        console.log(auth)
    if(token){
        const response = await fetch('/users', {
            method:"GET",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": auth,
            },
        })
        console.log(response)
      
        if(response.statusText == "Unauthorized") {
            console.log("heeereree")
            localStorage.clear()
            navigate('/')
            setToken(null)

        }
        else{
        const jsonData = await response.json()
        console.log(jsonData.data,"jsonDAta")
         if(jsonData.success)
        {
            setTimeout(()=>{
                setUsers(jsonData.data)
                setLoading(false)
            },300)
           
        }
        else {
            console.log("heeereree")
            localStorage.clear()
            navigate('/')
            setToken(null)

        }
    }
}
else{
   
    navigate('/')
}
    }

    useEffect(()=>{
       
            checkToken()
            return () => {
                console.log('This will be logged on unmount');
              };

    },[])
  return (
<> 
    {
        loading && <BounceLoader color={"green"} cssOverride={{
            display: "block",
            margin: "0 auto",
            borderColor: "red",
          }}  size={60} aria-label="Loading Spinner" />
    }
 { !loading ? <div className='container'>
   

     <table class="table table-hover align-middle">
         
        <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">TAGID</th>
                <th scope="col">FullName</th>
                <th scope="col">Email</th>
                <th scope="col">College</th>
                </tr>
        </thead>

            {users.map((user,index)=>{
                // const base64String = btoa(
                //     String.fromCharCode(...new Uint8Array(user.imageUrl.data.data))
                //   );
                return  <tbody>
                            <tr>
                                <th scope="row">{index+1}</th>
                                <th scope="row">{user.TAGID}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                
                                <td>
                                    {user.college}
                                    {/* <div className='col-md-8 col-sm-8 offset-2' >
                                        <div className='row'>
                                        <div className='col-md-4 col-sm-12'>
                                            <button class="btn btn-outline-primary w-100" type="button">VIEW</button>
                                        </div>
                                        <div className='col-md-4 col-sm-12'>
                                            <button class="btn btn-outline-warning  w-100" type="button">EDIT</button>
                                        </div>
                                        <div className='col-md-4 col-sm-12'>
                                            <button class="btn btn-outline-danger   w-100 " type="button">DELETE</button>
                                        </div>
                                        </div>
                                       
                                    </div> */}

                                        {/* <div class="d-grid gap-2 d-md-block ">
                                            <button class="btn btn-outline-primary " type="button">VIEW</button>
                                            <button class="btn btn-outline-primary " type="button">EDIT</button>
                                            <button class="btn btn-outline-primary " type="button">DELETE</button>
                                        </div> */}
                                </td>   

                            </tr>
                        </tbody>
            })
            
            }
        </table> 
        <input type={"button"} value={"Add New Student"} className="btn btn-dark mybtn" onClick={()=>{
                    navigate('/adduser')

        }}/>
    
     </div>: <div></div>
}
     </>
  )
}
