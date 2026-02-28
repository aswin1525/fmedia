import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SubmitProblem from './pages/SubmitProblem'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

function App() {
    const [alias, setAlias] = useState(localStorage.getItem('userAlias'));

    useEffect(() => {
        // Generate or fetch anonymous user profile
        if (!alias) {
            const newAlias = "Anon-" + Math.random().toString(36).substr(2, 8);
            localStorage.setItem('userAlias', newAlias);
            setAlias(newAlias);
        }
    }, [alias]);

    return (
        <Router>
            <div className="app-container">
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/submit" element={<SubmitProblem />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
                <Navbar />
            </div>
        </Router>
    )
}

export default App
