import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Launchpad from './Pages/Launchpad';
import Reports from './Pages/Reports';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';import Login from './Pages/Login';
import Layout from "./Component/Layout"
import PrivateRoutes from './Context/PrivateRoutes';
import Private from './Context/Private';
import Addjobs from './Pages/addjobs';
import { AuthProvider } from './Context/AuthContect';
import AdminRoute from './Context/AdminRoute';
import UserManagement from './Pages/usermanagement';
import AddUsers from './Pages/AddUsers';

const App = () => {

  
  return (
    <AuthProvider>
      {/* Removed BrowserRouter here */}
      <Routes>
        <Route element={<Private />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Layout/>}>
            <Route index  element={<Launchpad />} />
            <Route path="myreports" element={<Reports />} />
            <Route element={<AdminRoute/>}>
              <Route path="dashboard" element={<Dashboard />}/>
              <Route path="addjobs" element={<Addjobs />} />
            </Route>
            <Route element={<AdminRoute/>}>
              <Route path="/usermanagement" element={<UserManagement />} />
              <Route path="/AddUsers" element={<AddUsers />} />
            </Route>
            
            <Route path="myaccount" element={<Profile />} />
            
          </Route>
        </Route>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </AuthProvider>
  );
};

export default App;
