import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Launchpad from './Pages/Launchpad'
import Reports from './Pages/Reports'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile'
import Sidebar from './Component/Sidebar'
import Navbar from './Component/Navbar'

const App = () => {
  return (
    <div className="flex flex- md:flex-row">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Content Area */}
      <div className="flex-1 md:ml-48 mt-20 md:mt-0">{/* Add margin on large screens */}
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/myreports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/myaccount" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
