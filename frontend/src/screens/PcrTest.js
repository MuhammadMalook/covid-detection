import React,{ useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader';
import Faculty from './Faculty';



export default function PcrTest() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [token,setToken] = useState(localStorage.getItem("token"))
    const [url, seturl] = useState("students-pcr")
    const navigate = useNavigate()

    const checkToken = async() => {
        setLoading(true)
        var auth = "Bearer ".concat(JSON.parse(token))
        console.log(auth, url)
    if(token){
            const response = await fetch(`/${url}`, {
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
},[url])

  return (
    <> 
        {
            loading && <BounceLoader color={"green"} cssOverride={{
                display: "block",
                margin: "0 auto",
                borderColor: "red",
            }}  size={60} aria-label="Loading Spinner" />
        }
     <div className='container'>
        
       
      <select  style={{marginBottom:40}}
        onChange={(event) => seturl(event.target.value)}
       value={url}
      >
        <option value="students-pcr">Students</option>
        <option value="faculty-pcr">Faculty</option>
      </select>
            { !loading && users.length > 0 ? 
            <div style={{overflow:'auto'}}>
            <table class="table table-hover align-middle">
                
                <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">TAGID</th>
                        <th scope="col">FullName</th>
                        <th scope="col">Email</th>
                        <th scope="col">College</th>
                        <th scope="col">BodyTemp(°C)</th>
                        <th scope="col">PCR Result</th>
                      




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
                                        <td>{user.pcrResult}</td>   
                                         


                                    </tr>
                                </tbody>
                    })
                    
                    }
                </table> </div> :!loading ? <div style={{display:'flex', justifyContent:'center'}}>No data available</div>: <div></div>
        }
                {/* <input type={"button"} value={"Add New Student"} className="btn btn-dark mybtn" onClick={()=>{
                            navigate('/adduser')

                }}/> */}
            
            </div> 
            
     </>
  )
}
