import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Launchpad from './Pages/Launchpad';
import Reports from './Pages/Reports';
import Settings from './Pages/Settings';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import Notfound from './Component/Notfound';
import Login from './Pages/Login';
import Layout from "./Component/Layout"
import PrivateRoutes from './Context/PrivateRoutes';
import { AuthProvider } from './Context/AuthContect';

const App = () => {
  return (
    <AuthProvider>
      {/* Removed BrowserRouter here */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Layout/>}>
            <Route  index element={<Dashboard />} />
            <Route path="launchpad" element={<Launchpad />} />
            <Route path="myreports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="myaccount" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
