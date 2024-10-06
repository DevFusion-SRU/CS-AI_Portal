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
    </div>
  )
}

export default App
