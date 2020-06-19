import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'

import { Link } from 'react-router-dom'
const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(userContext)

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result.posts)
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)

            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.filter(item => {
                    return item._id != result._id
                })
                setData(newData)
            })
    }

    const deleteComment = (postId, commentId) => {
        //console.log(commentId)
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log("Replu from Server")
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    // {<h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>

    // <img style={{
    //     height: "30px",
    //     width: "30px",
    //     borderRadius: "15px",
    //     verticalAlign: "middle"
    // }} src={item.postedBy.pic} />
    // <span style={{verticalAlign: "middle"}}>  {item.postedBy.name}
    // </span>

    // </Link>
    // {item.postedBy._id == state._id

    //     && <i className="material-icons"
    //         style={{ float: "right", color: "red" }}
    //         onClick={() => { deletePost(item._id) }}
    //     >delete</i>

    // }
    // </h5>}


    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>


                            <div className="Post-user">
                                <div className="Post-user-avatar">
                                    <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                        <img src={item.postedBy.pic} />
                                    </Link>
                                </div>
                                <div className="Post-user-nickname">
                                    <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                        <span>{item.postedBy.name}</span>
                                    </Link>
                                    {item.postedBy._id == state._id

                                        && <i className="material-icons"
                                            style={{ float: "right", position:"absolute", right:"0px", color: "red" }}
                                            onClick={() => { deletePost(item._id) }}
                                        >delete</i>
                                    }
                                </div>


                            </div>




                            < div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">

                                {item.likes.includes(state._id)
                                    ? <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                    : <i className="material-icons" style={{ color: "black" }}>favorite</i>
                                }

                                {item.likes.includes(state._id)
                                    ? <i className="material-icons"
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    : <i className="material-icons"
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>
                                }


                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>

                                <p>{item.body}</p>



                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id} >
                                                {record.postedBy._id == state._id
                                                    && <i className="material-icons" style={{ color: "red", verticalAlign: "middle" }}
                                                        onClick={() => {
                                                            deleteComment(item._id, record._id)
                                                        }}
                                                    >delete</i>}
                                                <span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                    e.target.reset()
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }
        </div >
    )
}

export default Home