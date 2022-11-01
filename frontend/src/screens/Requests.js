import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import BounceLoader from 'react-spinners/BounceLoader';

export default function Requests() {

    const [data, setData] = useState([])
    const [loading, isLoading] = useState(false)
    const navigate = useNavigate()



    const getRequests = async() => {
        var token =  localStorage.getItem('token')

        var auth = "Bearer ".concat(JSON.parse(token))
    
        isLoading(true)

       
        const response = await fetch('/requests', {
            method:"GET",
            headers:{
                "Authorization":auth
            }
        })
        if(response.statusText == "Unauthorized")
        {

        }
        else
        {
            const requests = await response.json()
            if(requests.success)
            {
                console.log(requests)
                // setData(requests.data)
                setTimeout(()=>{
                    setData(requests.data)
                    isLoading(false)
                },300)
            }
            else{
                isLoading(false)
            }
        }
    }
useEffect(()=>{
    getRequests()
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

   { !loading && data.length > 0 ? <div style={{overflow:'auto'}}><table class="table table-image" style={{verticalAlign:'middle', textAlign:'center',  overflow:'auto', }}>
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">TAGID</th>
        <th scope="col">Temperature</th>
        <th scope="col">Test Status</th>
        <th scope="col">Accept</th>
        <th scope="col">Reject</th>
      </tr>
    </thead>
    <tbody>
        {
            data.map((item, index)=>{
                return <tr>
     
                <td class="w-25">
                    <img src={`/uploads/${item.imageSrc}`} class="img-fluid img-thumbnail " alt="pcr" style={{height:300, width:400}}/>
                </td>
                <td>{item.TAGID}</td>
                <td>{item.BodyTemp}</td>
                <td>{item.Test_Status}</td>

                <td><button className="btn btn-success" type="button" onClick={async()=>{
                    var token =  localStorage.getItem('token')
                    const body = {TAGID: item.TAGID, pcrResult:item.pcrResult, date:item.Test_Date, image:item.imageSrc}
                    console.log(body)
                    if(token)
                    {
                        console.log(token)
                        var auth = "Bearer ".concat(JSON.parse(token))
                        console.log(auth)
                        const response = await fetch('/add-pcr', {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": auth,

                        },
                        body: JSON.stringify(body)
                    })
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
                        //setApi(false)
                        if(jsonData.success)
                        {
                           alert("Accepted")
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
                }}>Accept</button></td>
                <td><button className="btn btn-warning" type="Reject" onClick={async()=>{

                    var token =  localStorage.getItem('token')
                    const body = {TAGID: item.TAGID}
                    console.log(body)
                    if(token)
                    {
                        console.log(token)
                        var auth = "Bearer ".concat(JSON.parse(token))
                        console.log(auth)
                        const response = await fetch('/reject-pcr', {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": auth,

                        },
                        body: JSON.stringify(body)
                    })
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
                        //setApi(false)
                        if(jsonData.success)
                        {
                            alert("Successfully Rejected")
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
                }}>Reject</button></td>
        
              </tr>
            })
        }
      
    </tbody>
  </table>   </div>:  !loading ? <div style={{display:'flex', justifyContent:'center'}}>No data available</div>: <div></div>}
  </>
  )
}
