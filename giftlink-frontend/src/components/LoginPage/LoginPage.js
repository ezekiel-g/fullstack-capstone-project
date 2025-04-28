import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { urlConfig } from '../../config'
import { useAppContext } from '../../context/AuthContext'
import './LoginPage.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [incorrect, setIncorrect] = useState('')
    const navigate = useNavigate()
    const bearerToken = sessionStorage.getItem('bearer-token')
    const { setIsLoggedIn, setUserName } = useAppContext()

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app')
        }
    }, [navigate])

    const handleLogin = async () => {
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: bearerToken ? `Bearer ${bearerToken}` : ''
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const json = await response.json()
        console.log('JSON: ', json)

        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken)
            sessionStorage.setItem('name', json.userName)
            sessionStorage.setItem('email', json.userEmail)
            setIsLoggedIn(true)
            setUserName(json.userName)
            navigate('/app')
        } else {
            document.getElementById('email').value = ''
            document.getElementById('password').value = ''
            setIncorrect('Wrong email address and/or password')
            // setTimeout(() => {
            //     setIncorrect('')
            // }, 2000)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">
                            Login
                        </h2>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={event => {
                                    setEmail(event.target.value)
                                    setIncorrect('')
                                }}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={event => {
                                    setPassword(event.target.value)
                                    setIncorrect('')
                                }}
                            />

                            <div className="text-danger">{incorrect}</div>
                        </div>
                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <p className="mt-4 text-center">
                            New here?{' '}
                            <Link to="/app/register" className="text-primary">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
