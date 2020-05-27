import React, { useEffect, useState, useContext } from 'react'

import { userContext } from '../../App'

const Profile = () => {
    const [selfProfile, setSelfProfile] = useState(null)
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
                setSelfProfile(result)
            })
    }, [])

    return (
        <>
            {selfProfile
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
                            <h4> {selfProfile.selfuser.name} </h4>

                            <div style={{ display: "flex", justifyContent: "space-around", width: "110%" }}>
                                <h6> {selfProfile.selfposts.length} post</h6>
                                <h6> {selfProfile.selfuser.followers.length} followers</h6>
                                <h6> {selfProfile.selfuser.following.length} following</h6>
                            </div>
                        </div>
                    </div>

                    { <div className="gallery">
                {
                    selfProfile.selfposts.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div> }
                </div>
                :
                <h2>Loading.....</h2>
            }
        </>
    )
}

export default Profile