import React,{useState} from 'react'
import {Link, useHistory,useParams} from 'react-router-dom'



import Swal from "sweetalert2";
const NewPassword = () => {
    const history = useHistory()
    const [password,setPassword] = useState("")

    const {token} = useParams()
    //console.log(token)
    const PostData =()=>{

        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            if(data.error){
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error
                  })
                
            }
            else{
               
                
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                  })
                history.push("/signin")
            }
        }).catch(err=>{
            console.log(err)
        })
    }



    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>IInstagram</h2>
                <input
                    type="password"
                    placeholder="enter a newpassword"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                Update Password
                </button>
            </div>
        </div>

    )
}

export default NewPassword