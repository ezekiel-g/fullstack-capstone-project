import React, { useState, useEffect } from 'react'

import './LoginPage.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async event => {
        event.preventDefault()
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
                                onChange={event => setEmail(event.target.value)}
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
                                onChange={event => setPassword(event.target.value)}
                            />
                        </div>
                        {/* Include appropriate error message if login is incorrect*/}
                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <p className="mt-4 text-center">
                            New here?{' '}
                            <a href="/app/register" className="text-primary">
                                Register Here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
