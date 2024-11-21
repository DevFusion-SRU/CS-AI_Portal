import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Launchpad from './Pages/Launchpad';
import Reports from './Pages/Reports';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Layout from "./Component/Layout";
import PrivateRoutes from './Context/PrivateRoutes';
import Private from './Context/Private';
import Addjobs from './Pages/addjobs';
import { useAuth } from "./Context/AuthContect";
import AdminRoute from './Context/AdminRoute';
import axios from 'axios';

const App = () => {
  const [userData, setUserData] = useState(null); // Store user details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const { currentUser} = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserEmail = currentUser?.email.split('@')[0].toUpperCase() // Replace this with actual email fetching logic
        if (!currentUserEmail) return;

        const emailPrefix = currentUserEmail.split('@')[0].toUpperCase();
        const response = await axios.get(`http://localhost:5000/api/students/${emailPrefix}`);
        setUserData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
      <Routes>
        <Route element={<Private />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route
            path="/"
            element={<Layout userPhoto={userData?.photo} />} // Pass photo to Layout
          >
            <Route index element={<Launchpad />} />
            <Route path="myreports" element={<Reports />} />
            <Route element={<AdminRoute />}>
              <Route path="dashboard" element={<Dashboard />}>
                <Route path="addjobs" element={<Addjobs />} />
              </Route>
            </Route>
            <Route
              path="myaccount"
              element={<Profile userData={userData} setUserData={setUserData} />} // Pass state to Profile
            />
          </Route>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>

  );
};

export default App;
