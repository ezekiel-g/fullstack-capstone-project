import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { urlConfig } from '../../config'
import { useAppContext } from '../../context/AuthContext'
import validateUser from '../../util/validateUser'
import './RegisterPage.css'

function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState([])
    const { setIsLoggedIn } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app')
        }
    }, [navigate])

    const handleRegister = async () => {
        setShowError([])

        const newErrors = []

        const firstNameValidation = validateUser.validateFirstName(firstName)
        if (!firstNameValidation.valid) newErrors.push(firstNameValidation.message)

        const lastNameValidation = validateUser.validateLastName(lastName)
        if (!lastNameValidation.valid) newErrors.push(lastNameValidation.message)

        const emailValidation = validateUser.validateEmail(email)
        if (!emailValidation.valid) newErrors.push(emailValidation.message)
        
        const passwordValidation = validateUser.validatePassword(password)
        if (!passwordValidation.valid) newErrors.push(passwordValidation.message)

        if (newErrors.length > 0) {
            setShowError(newErrors)
            return
        }

        const response = await fetch(
            `${urlConfig.backendUrl}/api/auth/register`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            }
        )

        const json = await response.json()

        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken)
            sessionStorage.setItem('name', firstName)
            sessionStorage.setItem('email', json.email)
            setIsLoggedIn(true)
            navigate('/app')
        }
        if (json.error) {
            setShowError([json.error])
        }
    }

    const errorDisplay = showError.map((error, index) => {
        return <li key={index}>{error}</li>
    })

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">
                            Register
                        </h2>

                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={event => setFirstName(event.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={event => setLastName(event.target.value)}
                            />
                        </div>

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

                        <ul className="text-danger">{errorDisplay}</ul>

                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                        <p className="mt-4 text-center">
                            Already a member?{' '}
                            <Link to="/app/login" className="text-primary">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
