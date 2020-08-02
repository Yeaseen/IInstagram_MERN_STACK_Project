import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Swal from "sweetalert2";
const Reset = () => {

    const history = useHistory()

    const [email, setEmail] = useState("")

    const PostData = () => {

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {


            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid email or password!'
            })
            return
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                if (data.error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.error
                    })

                }
                else {


                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push("/signin")

                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>IInstagram</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Reset Password
                </button>

            </div>
        </div>

    )
}

export default Reset