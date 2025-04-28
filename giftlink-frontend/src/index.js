import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Router future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
        }}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    </React.StrictMode>
)
