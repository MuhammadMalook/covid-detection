import React,{ useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader';

export default function Temperature() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [token,setToken] = useState(localStorage.getItem("token"))
    const navigate = useNavigate()

    const checkToken = async() => {
        setLoading(true)
        var auth = "Bearer ".concat(JSON.parse(token))
        console.log(auth)
    if(token){
            const response = await fetch('/users-temp', {
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
                        <th scope="col">BodyTemp(°C)</th>
                        <th scope="col">Test_Date</th>
                        <th scope="col">Test_Time</th>



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
                                        <td>{user.college}</td> 
                                        <td>{user.BodyTemp}</td>   
                                        <td>{user.Test_Date}</td>   
                                        <td>{user.Test_Time}</td>   


                                    </tr>
                                </tbody>
                    })
                    
                    }
                </table> 
                {/* <input type={"button"} value={"Add New Student"} className="btn btn-dark mybtn" onClick={()=>{
                            navigate('/adduser')

                }}/> */}
            
            </div>: <div></div>
        }
     </>
  )
}
