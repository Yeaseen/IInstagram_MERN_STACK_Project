import React, { useEffect, useState, useContext } from 'react'

import { userContext } from '../../App'

const Profile = () => {
    const [selfProfileUser, setSelfProfileUser] = useState(null)
    const [selfProfilePosts, setSelfProfilePosts] = useState([])
    const { state, dispatch } = useContext(userContext)
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

    const deletePost = (postid) => {
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
            })
    }

    return (
        <>
            {selfProfileUser
                ?
                <div style={{ maxWidth: "700px", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={selfProfileUser.pic}
                            />
                        </div>
                        <div>
                            <h4> {selfProfileUser.name} </h4>

                            <div style={{ display: "flex", justifyContent: "space-around", width: "110%" }}>
                                <h6> {selfProfilePosts.length} post</h6>
                                <h6> {selfProfileUser.followers.length} followers</h6>
                                <h6> {selfProfileUser.following.length} following</h6>
                            </div>
                        </div>
                    </div>

                    {<div className="gallery">
                        {
                            selfProfilePosts.map(item => {
                                return (
                                    <div key={item._id} className="gallery-content">
                                        <i className="material-icons"
                                            style={{ top:"0px", color: "red" }}
                                            onClick={() => { deletePost(item._id) }}
                                        >delete</i>
                                       
                                        <img src={item.photo} alt={item.title}  />
                                        
                                    </div>
                                )
                            })
                        }

                    </div>
                    }
                </div>
                :
                <h2>Loading.....</h2>
            }
        </>
    )
}

export default Profile