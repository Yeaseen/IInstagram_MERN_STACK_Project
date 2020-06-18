import React, { useEffect, createContext, useReducer, useContext } from 'react'
import WebSocketProvider, { WebSocketContext } from './WebSocket';
import NavBar from './components/Navbar'
import "./App.css"
import { BrowserRouter, Route, Switch, useHistory, useLocation, Redirect } from 'react-router-dom'
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
    const location = useLocation()
    const { state, dispatch } = useContext(userContext)

    //ustate = state
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        //console.log(typeof(user),user)
        //console.log(location.pathname);
        if (user) {
            dispatch({ type: "USER", payload: user })

        }
        else {
            history.push('/signin')
            //console.log(location.pathname);
            //{(state && location.pathname=="/signin")?history.push('/'):<SignIn />}
        }

    }, [])


    return (
        <Switch>
            <Route exact path="/" >
                <Home />
            </Route>

            <Route exact path="/signin" >
                {(state && location.pathname == "/signin")
                    ? history.push('/')
                    : <SignIn />}
            </Route>



            <Route exact path="/signup" >
                {(state && location.pathname == "/signup")
                    ? history.push('/')
                    : <SignUp />}
            </Route>

            <Route exact path="/profile" >
                <Profile />
            </Route>

            <Route exact path="/createpost" >
                <CreatePost />
            </Route>

            <Route exact path="/profile/:userid" >
                <UserProfile />
            </Route>

            <Route exact path="/myfollowingposts" >
                <SubscribedUserPosts />
            </Route>

            <Route exact path="/chatdashboard" >
                <ChatDashboard />
            </Route>

            <Route exact path="/chatroompage/:chatroomId" >
                <ChatRoomPage />
            </Route>

        </Switch>
    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    
    return (
        <userContext.Provider value={{ state, dispatch }}>
            <WebSocketProvider >

                <BrowserRouter>
                    <NavBar />
                    <Routing  />
                </BrowserRouter>

            </WebSocketProvider>


        </userContext.Provider>


    );
}

export default App;