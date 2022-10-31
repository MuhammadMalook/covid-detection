import React, { useEffect, useState } from 'react'

import BounceLoader from 'react-spinners/BounceLoader';

export default function Requests() {

    const [data, setData] = useState([])
    const [loading, isLoading] = useState(false)



    const getRequests = async() => {
        isLoading(true)
        const response = await fetch('/requests', {
            method:"GET"
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

   { !loading && data.length > 0 ? <div><table class="table table-image" style={{verticalAlign:'middle', textAlign:'center'}}>
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
                    <img src={`/uploads/${item.imageSrc}`} class="img-fluid img-thumbnail" alt="pcr"/>
                </td>
                <td>{item.TAGID}</td>
                <td>{item.BodyTemp}</td>
                <td>{item.Test_Status}</td>

                <td><button className="btn btn-success" type="button">Accept</button></td>
                <td><button className="btn btn-warning" type="Reject">Reject</button></td>
        
              </tr>
            })
        }
      
    </tbody>
  </table>   </div>:  !loading ? <div style={{display:'flex', justifyContent:'center'}}>No data available</div>: <div></div>}
  </>
  )
}
