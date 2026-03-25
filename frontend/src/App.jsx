import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SubmitProblem from './pages/SubmitProblem'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'

const Layout = ({ children }) => (
    <div className="app-container">
        <main className="main-content">
            {children}
        </main>
        <Navbar />
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/feed" element={<Layout><Home /></Layout>} />
                    <Route path="/submit" element={<Layout><SubmitProblem /></Layout>} />
                    <Route path="/search" element={<Layout><Search /></Layout>} />
                    <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/profile/:alias" element={<Layout><Profile /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                    <Route path="/signup" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
