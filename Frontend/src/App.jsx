import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Launchpad from './Pages/Launchpad'
import Reports from './Pages/Reports'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile'
import Sidebar from './Component/sidebar'



const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="flex-grow p-6"> {/* This div will take the remaining space */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/myreports" element={<Reports />} />
          <Route path="/myaccount" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
