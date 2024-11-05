import React, { useState } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Charlene Reed',
    email: 'charlenereed@gmail.com',
    dob: '25 January 1990',
    pan: 'ABCD9876EF',
    mentor: 'Prof. John Smith',
    userName: 'Charlene Reed',
    password: '*********',
    hallticket: '2103A50000',
    aadhar: '1111-0000-2222',
    phone: '+91-XXXXX-XXXXX'
  });

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Handle save logic
    console.log('Saved data:', userData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Add top padding to prevent overlapping with navbar */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl mt-20 md:mt-24">
        {/* Tabs */}
        <div className="flex mb-6 border-b-2 border-gray-200">
          <button className="pb-2 px-4 font-semibold text-blue-600 border-b-2 border-blue-600 transition-all duration-300">
            Edit Profile
          </button>
          <button className="pb-2 px-4 font-semibold text-gray-500 hover:text-blue-600 transition-all duration-300">
            Security
          </button>
        </div>

        {/* Profile Image and Info */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="flex-shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=3" // Replace with dynamic user image
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-blue-500"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'userName', 'email', 'password', 'dob', 'hallticket', 'pan', 'aadhar', 'mentor', 'phone'].map((field, index) => (
            <div key={index} className="relative">
              <label className="text-gray-500 text-sm absolute top-0 left-3 -translate-y-6 scale-75 origin-left transform peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 transition-all">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={userData[field]}
                onChange={handleInputChange}
                className="mt-1 peer block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all placeholder-transparent"
                placeholder={field}
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
