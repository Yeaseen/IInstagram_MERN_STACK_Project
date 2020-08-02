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
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
import ChatDashboard from './components/screens/ChatDashboard'
import ChatRoomPage from './components/screens/ChatRoomPage'
import { reducer, initialState } from './reducers/userReducer'

export const userContext = createContext()

const AuthRoute = ({ loggedIn, path, component: Component }) => (
    <Route
        path={path}
        render={props => (
            loggedIn ?
                <Redirect to='/' /> :
                <Component {...props} />
        )}
    />
);



const Routing = (props) => {
    const history = useHistory()

    const { state, dispatch } = useContext(userContext)

    //ustate = state
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))

        if (user) {
            dispatch({ type: "USER", payload: user })

        }
        else {
            if (!history.location.pathname.startsWith('/reset')) {
                history.push('/signin')
            }
        }

    }, [])


    return (
        <Switch>
            <Route exact path="/" >
                <Home />
            </Route>

            {/* <Route exact path="/signin" >
                {(state && location.pathname == "/signin")
                    ? history.push('/')
                    : <SignIn />}
            </Route>



            <Route exact path="/signup" >
                {(state && location.pathname == "/signup")
                    ? history.push('/')
                    : <SignUp />}
            </Route> */}


            <AuthRoute loggedIn={state} path="/signin" component={SignIn} />
            <AuthRoute loggedIn={state} path="/signup" component={SignUp} />

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

            <Route exact path="/reset" >
                <Reset />
            </Route>

            <Route path="/reset/:token" >
                <NewPassword />
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
            <WebSocketProvider  >

                <BrowserRouter>
                    <NavBar />
                    <Routing />
                </BrowserRouter>

            </WebSocketProvider>

        </userContext.Provider>


    );
}

export default App;