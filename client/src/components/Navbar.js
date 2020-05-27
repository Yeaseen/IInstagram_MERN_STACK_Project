import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { userContext } from '../App'


const NavBar = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(userContext)
    const renderList = (() => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost">Createpost</Link></li>,
                <li><Link to="/myfollowingposts">My Following Posts</Link></li>,
                <li>
                    <button className="btn #c62828 red darken-3"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            history.push("/signin")
                        }}
                    >
                        Logout
                    </button>
                </li>

            ]
        }
        else {
            return [
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    })
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">IInstagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar