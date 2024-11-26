import React, { useEffect, useState } from "react";
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

const App = () => {
  const { currentUser, currentUserRole, BASE_URL } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      if (!currentUser) return;
      let endpoint;

      if (currentUserRole === "admin") {
        endpoint = `${BASE_URL}admins/${currentUser.username}`;
      } else if (currentUserRole === "student") {
        endpoint = `${BASE_URL}students/${currentUser.username}`;
      } else {
        throw new Error("Unknown role or unauthorized access");
      }
      const response = await fetch(
        endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        credentials: "include",
      }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Error fetching user data");
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
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route
          path="/"
          element={<Layout userData={userData} setUserData={setUserData} />}
        >
          <Route index element={<Launchpad />} />
          <Route path="myreports" element={<Reports />} />
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
        </Route>
      </Route>

    </Routes>
  );
};

export default App;
