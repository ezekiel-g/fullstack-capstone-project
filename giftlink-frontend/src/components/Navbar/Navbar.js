import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext'

function Navbar() {
    const { setIsLoggedIn, setUserName } = useAppContext()
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token')
        sessionStorage.removeItem('name')
        sessionStorage.removeItem('email')
        setIsLoggedIn(false)
        setUserName('')
        navigate('/app')
    }

    const nameFromSession = sessionStorage.getItem('name')
    let loginOrWelcome
    let logoutOrRegister

    if (!nameFromSession) {
        loginOrWelcome =
            <li className="nav-item">
                <Link className="nav-link" to="/app/login">Login</Link>
            </li>
        logoutOrRegister =
            <li className="nav-item">
                <Link className="nav-link" to="/app/register">Register</Link>
            </li>
    } else {
        loginOrWelcome =
            <li className="nav-item">
                <Link className="nav-link" to="/app/profile" style={{ color: '#000' }}>
                    Welcome,{' '}{nameFromSession}
                </Link>
            </li>
        logoutOrRegister =
            <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                    Logout
                </button>
            </li>
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                    {loginOrWelcome}
                    {logoutOrRegister}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
