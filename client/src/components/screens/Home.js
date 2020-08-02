import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'
import Swal from "sweetalert2";
import { Link } from 'react-router-dom'
import moment from 'moment'
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
                        const newData = data.filter(item => {
                            return item._id != result._id
                        })
                        setData(newData)
                        Swal.fire(
                            'Deleted!',
                            'Your Post has been removed.',
                            'success'
                        )
                    })

            }
        })







    }

    const deleteComment = (postId, commentId) => {
        //console.log(commentId)
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
                        Swal.fire(
                            'Deleted!',
                            'Your Comment has been removed.',
                            'success'
                        )
                    })
            }
        })

    }






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
                                    <br></br>
                                    <span style={{fontSize:"12px", fontWeight:"normal"}}> created at {moment(item.createdAt).format("L LTS")}</span>
                                    {item.postedBy._id == state._id

                                        && <i className="material-icons"
                                            style={{ float: "right", position: "absolute", right: "0px", color: "red" }}
                                            //onClick={() => { deletePost(item._id) }}
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
                                <div style={{ borderBottom: "2px solid blue" }}>
                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                </div>


                                {
                                    item.comments.map(record => {
                                        return (

                                            <div className="Comment-user" key={record._id}>
                                                <div>
                                                    <div className="Comment-user-avatar">
                                                        <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"}>
                                                            <img src={record.postedBy.pic} />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="Comment-user-nickname">
                                                    <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"}>
                                                        <span style={{ fontFamily: "'PT Sans', sans-serif", fontWeight: "bold" }}>{record.postedBy.name}</span>
                                                    </Link>
                                                    <br></br>
                                                    {record.text}
                                                    {record.postedBy._id == state._id

                                                        && <i className="material-icons"
                                                            style={{ float: "right", position: "absolute", right: "0px", color: "red" }}
                                                            onClick={() => { deleteComment(item._id, record._id) }}
                                                        >delete</i>
                                                    }
                                                </div>
                                            </div>
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