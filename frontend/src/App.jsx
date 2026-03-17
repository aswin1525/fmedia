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

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/submit" element={<SubmitProblem />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile/:alias" element={<Profile />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Routes>
                    </main>
                    <Navbar />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
