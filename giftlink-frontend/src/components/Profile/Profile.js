import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext'
import { urlConfig } from '../../config'
import validateUser from '../../util/validateUser'
import './Profile.css'

const Profile = () => {
    const [userDetails, setUserDetails] = useState({})
    const [updatedDetails, setUpdatedDetails] = useState({})
    const { setUserName } = useAppContext()
    const [changed, setChanged] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [errors, setErrors] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const authtoken = sessionStorage.getItem('auth-token')
        !authtoken ? navigate('/app/login') : fetchUserProfile()
    }, [navigate])

    const fetchUserProfile = async () => {
        try {
            const authtoken = sessionStorage.getItem('auth-token')
            const email = sessionStorage.getItem('email')
            const name = sessionStorage.getItem('name')
            
            if (name || authtoken) {
                const storedUserDetails = {
                    name: name,
                    email: email
                }

                setUserDetails(storedUserDetails)
                setUpdatedDetails(storedUserDetails)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleInputChange = event => {
        setUpdatedDetails({
            ...updatedDetails,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit = async event => {
        event.preventDefault()

        setErrors([])

        const newErrors = []

        const firstNameValidation = validateUser.validateFirstName(updatedDetails.name)
        if (!firstNameValidation.valid) newErrors.push(firstNameValidation.message)

        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const authtoken = sessionStorage.getItem('auth-token')
            const email = sessionStorage.getItem('email')

            if (!authtoken || !email) {
                navigate('/app/login')
                return
            }

            const payload = { ...updatedDetails }
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/update`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authtoken}`,
                        'Content-Type': 'application/json',
                        Email: email
                    },
                    body: JSON.stringify(payload)
                }
            )

            if (response.ok) {
                setUserName(updatedDetails.name)
                sessionStorage.setItem('name', updatedDetails.name)
                setUserDetails(updatedDetails)
                setEditMode(false)
                setChanged('Name changed successfully!')
                setTimeout(() => {
                    setChanged('')
                    navigate('/')
                }, 1000)
            } else {
                throw new Error('Failed to update profile')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const errorDisplay = errors.map((error, index) => {
        return <li key={index}>{error}</li>
    })

    return (
        <div className="profile-container">
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            disabled
                        />
                    </label>
                    <label>
                        First name
                        <input
                            type="text"
                            name="name"
                            value={updatedDetails.name}
                            onChange={handleInputChange}
                        />
                    </label>

                    <button type="submit">Save</button>
                </form>
            ) : (
                <div className="profile-details">
                    <h1>Hi, {userDetails.name}</h1>
                    <p>
                        {' '}
                        <b>Email:</b> {userDetails.email}
                    </p>
                    <button onClick={handleEdit}>Edit</button>
                    <span style={{ color: 'green' }}>
                        {changed}
                    </span>
                </div>
            )}
            <ul className="text-danger">{errorDisplay}</ul>
        </div>
    )
}

export default Profile
