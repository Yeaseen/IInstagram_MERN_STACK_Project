import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'

import { WebSocketContext } from '../../WebSocket'
import { useParams } from 'react-router-dom'


const ChatRoomPage = () => {
    const { chatroomId } = useParams()
    const ws = useContext(WebSocketContext)
    const [messages, setMessages] = useState([])
    const { state, dispatch } = useContext(userContext)
    const messageRef = React.useRef()

    const sendMessage = () => {
        if (ws.socket) {
            ws.socket.emit("chatroomMessage", {
                chatroomId,
                message: messageRef.current.value
            })

            messageRef.current.value=""
        }
    }

    useEffect(() => {
        if (ws.socket) {
            ws.socket.on("newMessage", (message) => {
                const newMessages = [...messages, message]
                setMessages(newMessages)
            })

        }
        // eslint-disable-next-line
    }, [messages])


    useEffect(() => {

        if (ws.socket) {
            ws.socket.emit("joinRoom", {
                chatroomId
            })
        }
        return () => {
            if (ws.socket) {
                ws.socket.emit("leaveRoom", {
                    chatroomId
                })
            }
        }
        // eslint-disable-next-line
    }, [])


    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="chatcardHeader">Chatroom Name</div>
                <div className="chatroomContent">
                    {
                        messages.map((message) => (

                            <div key={message._id} className="message">
                                <span className={state._id == message.userId ? "ownMessage" : "otherMessage"}
                                >{message.name}: </span> {" "}
                                {message.message}
                            </div>

                        ))
                    }


                </div>

                <div className="chatroomActions">
                    <div>
                        <input
                            type="text"
                            name="message"
                            placeholder="Say something"
                            ref={messageRef}
                        />
                    </div>
                    <div >
                        <button className="join"
                            onClick={sendMessage}
                        > send </button>

                    </div>

                </div>


            </div>
        </div>
    )
}

export default ChatRoomPage