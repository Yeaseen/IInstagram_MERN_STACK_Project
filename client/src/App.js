import React, { useEffect, createContext, useReducer, useContext, useState } from 'react'
import WebSocketProvider, { WebSocketContext } from './WebSocket';
import NavBar from './components/Navbar'
import "./App.css"
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import SignIn from './components/screens/Signin'
import SignUp from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribeUserPosts'
import ChatDashboard from './components/screens/ChatDashboard'
import ChatRoomPage from './components/screens/ChatRoomPage'
import { reducer, initialState } from './reducers/userReducer'


export const userContext = createContext()


    



const Routing = (props) => {
    const history = useHistory()
    const { state, dispatch } = useContext(userContext)

    




    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        //console.log(typeof(user),user)

        if (user) {
            dispatch({ type: "USER", payload: user })
            //setupSocket();
        }
        else {
            history.push('/signin')
        }

    }, [])

    return (
        <Switch>
            <Route exact path="/" >
                <Home />
            </Route>

            <Route path="/signin" >
                <SignIn  />
                
            </Route>

            <Route path="/signup" >
                <SignUp  />
            </Route>

            <Route exact path="/profile" >
                <Profile />
            </Route>

            <Route path="/createpost" >
                <CreatePost />
            </Route>

            <Route path="/profile/:userid" >
                <UserProfile />
            </Route>

            <Route path="/myfollowingposts" >
                <SubscribedUserPosts />
            </Route>

            <Route path="/chatdashboard" >
                <ChatDashboard />
            </Route>

            <Route path="/chatroompage/:id" >
                <ChatRoomPage />
            </Route>



        </Switch>

    )

}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    

    
    return (
        <userContext.Provider value={{ state, dispatch }}>
            <WebSocketProvider>

            <BrowserRouter>
                <NavBar  />
                <Routing />
            </BrowserRouter>

            </WebSocketProvider>
           

        </userContext.Provider>


    );
}

export default App;