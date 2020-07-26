import React, { useEffect, useState, useContext, useRef } from 'react'
import { userContext } from '../../App'

import axios from 'axios';
import Swal from "sweetalert2";


const Profile = () => {
    const [selfProfileUser, setSelfProfileUser] = useState(null)
    const [selfProfilePosts, setSelfProfilePosts] = useState([])
    const [uploadPercentage, setUploadPercentage] = useState(0)
    const [progressStyle, setProgressStyle] = useState({})
    const { state, dispatch } = useContext(userContext)

    const [image, setImage] = useState("")

    const setProgressStyleF = (per) => {
        var p = (per / 100) * 645
        //console.log(p)
        const newStyle = {
            opacity: 1,
            width: p
        }

        setProgressStyle(newStyle)

    }



    useEffect(() => {

        fetch('/mypost', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setSelfProfileUser(result.selfuser)
                setSelfProfilePosts(result.selfposts)
            })
    }, [])

    useEffect(() => {
        if (image) {

            setUploadPercentage(1)
            setProgressStyleF(1)
            const data = new FormData()
            data.append("file", image)

            axios.post('/upload', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
                .then(response => {
                    //console.log(response)
                    setUploadPercentage(50)
                    setProgressStyleF(50)

                    fetch('/updateprofilepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: response.data.secure_url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            //console.log(result)
                            setSelfProfileUser(result)
                            setUploadPercentage(100)
                            setProgressStyleF(100)

                            setTimeout(() => {

                                setUploadPercentage(0)
                                setProgressStyleF(0)
                            }, 1300)
                        })
                }).catch(error => {
                    console.log(error)
                })
        }
    }, [image])


    const updateProfilePic = (e) => {
        setImage(e.target.files[0])

        e.target.value = null;


    }


    const deletePost = (postid) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            if (result.value) {
                fetch(`/deletepost/${postid}`, {
                    method: "delete",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    }
                }).then(res => res.json())
                    .then(result => {
                        //console.log(result)
                        const newData = selfProfilePosts.filter(item => {
                            return item._id != result._id
                        })
                        setSelfProfilePosts(newData)
                        Swal.fire(
                            'Deleted!',
                            'Your Post has been removed.',
                            'success'
                        )
                    })

            }
        })
    }



    return (
        <>
            {selfProfileUser
                ?
                <div style={{ maxWidth: "700px", margin: "0px auto" }}>
                    <div style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",

                        }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={selfProfileUser.pic}
                                />
                            </div>
                            <div>
                                <h4> {selfProfileUser.name} </h4>

                                <div style={{ display: "flex", justifyContent: "space-around", width: "110%" }}>
                                    <h6> {selfProfilePosts.length} posts</h6>
                                    <h6> {selfProfileUser.followers.length} followers</h6>
                                    <h6> {selfProfileUser.following.length} following</h6>
                                </div>
                            </div>
                        </div>

                        <div className="file-field input-field" style={{ margin: "1px 0px 10px 55px" }}>
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Update Profile Picture</span>

                                <input type="file" onChange={(e) => {
                                    e.preventDefault()
                                    //updateProfilePic(e.target.files[0])
                                    updateProfilePic(e)
                                    
                                }} />
                            </div>
                            <div className="file-path-wrapper input-field">
                                <input className="file-path validate" type="text" />
                            </div>

                            {uploadPercentage > 0 &&
                                <div className="progress" >
                                    <div className="progress-done" style={progressStyle}>
                                        {uploadPercentage}%
	                                </div>
                                </div>
                            }
                        </div>







                    </div>
                    <div className="gallery">
                        {
                            selfProfilePosts.map(item => {
                                return (
                                    <div key={item._id} className="gallery-content">
                                        <i className="material-icons"
                                            style={{ top: "0px", color: "red" }}
                                            onClick={() => { deletePost(item._id) }}
                                        >delete</i>
                                        <img src={item.photo} alt={item.title} />

                                    </div>
                                )
                            })
                        }

                    </div>

                </div>
                :
                <h2>Loading.....</h2>
            }
        </>
    )
}

export default Profile