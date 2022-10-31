import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import { Field } from 'formik';
import BounceLoader from 'react-spinners/BounceLoader';
import store from '../redux/store';
import { login, logout } from '../redux/constants';
import { useSelector } from 'react-redux';

export default function AddPcr() {
    const [pcr, setPcr] = useState()
    const [api, setApi] = useState(false)
    const [pending, setPending] = useState(false)
    const role = useSelector((state)=>state.role)
    const token = localStorage.getItem('token')
    const [msg, setMsg] = useState("no data available")
    const [date, setDate] = useState()
    const [TAGID, setTAGID] = useState()

    const [image, setImage] = useState()
    const [imgPath, setImgPath] = useState()

    const navigate = useNavigate()

    const checkToken = async() => {
        var auth = "Bearer ".concat(JSON.parse(token))
        console.log(auth,"auth")
        setApi(true)
        
       if(token){
        console.log(token)
        var auth = "Bearer ".concat(JSON.parse(token))
        console.log(auth)
    
        const response = await fetch(`/getMyPcr/${token}/${role}`, {
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
                console.log("unauth in addpcr")
                localStorage.clear()
                navigate('/')
             
       }
       else{
        const jsonData = await response.json()
        console.log(jsonData)
        console.log(jsonData,"addpcr")
        setTimeout(()=>{
            setApi(false)
        },500)
        if(jsonData.success)
        {
            setMsg(jsonData.msg)
            if(jsonData.data)
            {
                setPending(true)
                setDate(jsonData.data.Test_Date)
                setTAGID(jsonData.data.TAGID)

            }
            else
                setPending(false)

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

  const handleChange = (e)=>{
    console.log(e.target.value)
        setPcr(e.target.value)
  }  

  const imgFilehandler = (e) => {
    if (e.target.files.length !== 0) {
    setImgPath(e.target.files[0])
      setImage(URL.createObjectURL(e.target.files[0]))
    }
  }

useEffect(()=>{
        checkToken()
        return () => {
            console.log('This will be logged on unmount');
          };
},[role])

  return (
    <>
    {
        api && <BounceLoader color={"green"} cssOverride={{
            display: "block",
            margin: "0 auto",
            borderColor: "red",
          }}  size={60} aria-label="Loading Spinner" />
    }
    { !api && pending ? <div className='container'>
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
                    <input style={{margin:20}}
                        className={'form-control shadow-none'}
                        // name = "imageUrl"
                        type={'file'}
                        autoComplete="off"
                        //onChange={(event)=>setImageUrl(event.target.files[0])}
                        onChange={imgFilehandler} 
                    />
                    <img src={image} alt='' width={400} height={300}></img>
                     <h4>Please select your PCR result</h4>   
                    <div role="group" aria-labelledby="my-radio-group" style={{display:'flex',justifyContent:'space-evenly', alignContent:'center', marginTop:30}}>
                            <label>
                            <input type="radio" name="pcr" value="0" onChange={handleChange}/>
                                    0
                            </label>
                            <label>
                                <input type="radio" name="pcr" value="1"  onChange={handleChange}/>
                                1
                            </label>
                            {date}
                            
                        </div>
                         <input type={"button"} className="btn btn-primary btn-lg mt-4" value={"Submit"} onClick={async()=>{
                            console.log(pcr)
                            var token =  localStorage.getItem('token')
                            let data = new FormData()
                            data.append("pcrResult", pcr)
                            data.append("token", token)
                            data.append("role", role)
                            data.append("date", date)
                            data.append("image", imgPath)
                         
                      
                            //const body = {pcrResult:pcr,token, role, date, image:imgPath}
                            if(token)
                            {
                                console.log(token)
                                var auth = "Bearer ".concat(JSON.parse(token))
                                console.log(auth)
                                const response = await fetch('/addRequest', {
                                    method:"POST",
                                    headers:{
                                        "Authorization": auth,
                                    },
                                    body: data
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
                                    alert("You have submitted Your result, Thanks")
                                 }
                                 else {
                                     localStorage.clear()
                                     navigate('/')
                             
                                 }
                                }

                            }
                            else{
                                alert("error")
                            }
                         }}/>
                    </div>
                </div>
                
            </div>
        </div>
    </div> : !api ? <div style={{display:'flex', justifyContent:'center'}}>{msg}</div>: <div></div>
    }
    </>
  )
}
