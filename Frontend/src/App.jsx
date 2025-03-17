import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Routes, Route } from "react-router-dom";
import Launchpad from "./Pages/Launchpad";
import Reports from "./Pages/Reports";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Layout from "./Component/Layout";
import PrivateRoutes from "./Context/PrivateRoutes";
import Private from "./Context/Private";
import Addjobs from "./Pages/Addjobs";
import { useAuth } from "./Context/AuthContext";
import AdminRoute from './Context/AdminRoute';
import UserManagement from './Pages/UserManagement';
import AddUsers from './Pages/AddUsers';
import Forgotpassword from "./Pages/Forgotpassword";
import Discussions from "./Pages/Discussions";
import JobView from './Pages/jobview';
import SavedJobs from "./Pages/SavedJobs";

const App = () => {
  const { currentUser, currentUserRole, BASE_URL } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const fetchUserData = async () => {
    try {
      if (!currentUser || !currentUser.rollNumber) {  // Change to rollNumber
        console.log("No currentUser or rollNumber, skipping fetch");
        return;
      }
      let endpoint;
      if (currentUserRole === "staff") {
        endpoint = `${BASE_URL}staff/${currentUser.rollNumber}`;  // Adjust if staff uses different ID
      } else if (currentUserRole === "student") {
        endpoint = `${BASE_URL}students/${currentUser.rollNumber}`;
      } else {
        throw new Error("Unknown role or unauthorized access");
      }
      console.log("Current User:", currentUser.username);
      console.log("Fetching from:", endpoint);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      setUserData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err.response?.status, err.response?.data || err.message);
      if (err.response?.status === 404) {
        setUserData({ rollNumber: currentUser.rollNumber, role: currentUserRole });  // Update here too
      }else {
        setError("Error fetching user data");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <Routes>
      <Route element={<Private />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route
          path="/"
          element={<Layout userData={userData} setUserData={setUserData} />}
        >
          <Route index element={<Launchpad />} />
          <Route path="myreports" element={<Reports />} />
          <Route path="jobs/:jobId" element={<JobView />} />
          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="addjobs" element={<Addjobs />} />
            <Route path="usermanagement" element={<UserManagement />} />
            <Route path="addusers" element={<AddUsers />} />
          </Route>
          <Route
            path="myaccount"
            element={<Profile userData={userData} setUserData={setUserData} />}
          />
          <Route path="discussions" element={<Discussions />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;