import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'


import { useParams } from 'react-router-dom'

const ChatRoomPage = ()=>{
    const {chatroomId} = useParams()

    
    return(
        <div>
         WoW Chatroompage!!
        </div>
    )
}

export default ChatRoomPage