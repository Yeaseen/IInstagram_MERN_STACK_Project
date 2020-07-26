import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

//import {WebSocketContext} from '../../WebSocket'




const ChatDashboard = () => {
    const [chatrooms, setChatrooms] = useState([])
    
   
    const getChatrooms = () => {

        fetch('/chatdashboard', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result.chatrooms)
                setChatrooms(result.chatrooms)
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000)
            })

    }
  
       
    useEffect( () => {
        const token = localStorage.getItem("jwt")
    
       
        getChatrooms()


        return () => {
            
            console.log('unmounting...')
        }
        // eslint-disable-next-line
        
    }, [])

    return (
        <div className="chatcard">
            <div className="chatcardHeader">Chatrooms</div>
            <div className="chatcardBody">
                <div className="chatinputGroup">
                    <label className="chatlabel" htmlFor="chatroomName">Chatroom Name</label>
                    <input className="chatinput"
                        type="text"
                        name="chatroomName"
                        id="chatroomName"
                        placeholder="ChatterBox CTG"
                    />
                </div>
            </div>

            <button className="chatbutton">Create Chatroom</button>
            <div className="chatrooms">
                {chatrooms.map(chatroom => {
                    return (
                        <div key={chatroom._id} className="chatroom">
                            <div>{chatroom.name}</div>
                            <Link to={"/chatroompage/"+chatroom._id}>
                                <div className="join">Join</div>
                            </Link>
                        </div>

                    )


                })
                }
            </div>
        </div>
    )

}

export default ChatDashboard