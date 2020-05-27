import React, { useEffect, useState, useContext } from 'react'

import { userContext } from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [showfollow, setShowFollow] = useState(true)
    const { state, dispatch } = useContext(userContext)
    const { userid } = useParams()
    //console.log("userid", userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setProfile(result)
                {result.isFollower ? setShowFollow(false) : setShowFollow(true) }
            }) 
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                userProfile.user = data
                setShowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                userProfile.user = data
                setShowFollow(true)

            })
    }
    return (
        <>
            {userProfile
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
                                src="https://images.unsplash.com/flagged/photo-1578894238942-d3b78cef5c0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-around", width: "110%" }}>
                                <h6>{userProfile.posts.length} post</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                           
                            {
                                showfollow
                                    ? <button style={{
                                        margin: "10px",
                                        left: "60px"
                                    }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => followUser()}
                                    >
                                        Follow
                                    </button>
                                    : <button style={{
                                        margin: "10px",
                                        left: "60px"
                                    }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => unfollowUser()}
                                    >
                                        unFollow
                                    </button>
                            }
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }

                    </div>

                </div>
                : <h2>Loading.....</h2>
            }

        </>

    )
}

export default UserProfile