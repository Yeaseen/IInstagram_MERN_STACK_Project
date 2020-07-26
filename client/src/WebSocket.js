import React, { createContext, useState } from 'react'
import io from 'socket.io-client';




const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
    let ws;

    const [socket, setSocket] = useState(null)
   
    const setupSocket = (token) => {
        
        //const token = localStorage.getItem("jwt")
        if (token && !socket) {
            const newSocket = io('localhost:5000', {
                query: {
                    token,
                }
            })

            newSocket.on("disconnect", () => {
                setSocket(null)
                setTimeout(setupSocket, 100)
                //makeToast("error", "Socket Disconnected")
            })

            newSocket.on("connect", ()=>{
               // makeToast("success", "Socket Connected!!!")
                console.log(newSocket)

            })
            setSocket(newSocket)
        }
    }

    ws = {
        socket,
        setupSocket
    }


    

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}