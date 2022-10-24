import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AddPcr() {
    const [pcr, setPcr] = useState()
    const [api, setApi] = useState(true)

    const navigate = useNavigate()

    const checkToken = async() => {
        console.log("ssdsd")
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
        //   if(role == "admin")
        //     navigate('/home')
        //   else
        //     navigate('/addPcr')
        }
        else {
            localStorage.clear()
            navigate('/')
           
    
        }
      }
    }
      else{
            navigate('/')
            setApi(true)
      }
    }

useEffect(()=>{
        checkToken()
        return () => {
            console.log('This will be logged on unmount');
          };
},[])

  return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-12 col-sm-12'>
                <div className='row'>
                    <div className='col-md-12 col-sm-12'>
                        <h2>Please Take PCR test and Upload Result within 48 horus</h2>
                    </div>
                       
                </div>
                <div className='row'>
                    <div className='col-md-4 col-sm-2'>

                    </div>
                    <div className='col-md-4 col-sm-8'>
                         <input className="form-control mt-3" value={pcr} name="pcr"/>
                         <input className="btn btn-primary mt-2" value={"Submit"} />
                    </div>
                </div>
                
            </div>
        </div>
    </div>

  )
}
