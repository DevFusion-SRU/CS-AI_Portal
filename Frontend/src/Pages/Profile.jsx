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
    phone: '+91-XXXXX-XXXXX',
  });

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saved data:', userData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-12">
      <main className="min-h-screen bg-white p-8 rounded-lg shadow-xl">
        {/* Tabs */}
        <div className="flex mb-8 border-b-2 border-gray-300">
          <button className="pb-2 px-4 font-semibold text-blue-600 border-b-2 border-blue-600 transition-all duration-300">
            Edit Profile
          </button>
        </div>

        {/* Profile Image and Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="Profile"
                className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-500"
              />
              {/* Edit Icon Overlay */}
              <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white cursor-pointer hover:bg-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13h3l8.232-8.232a2 2 0 00-2.828-2.828L9 10v3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mt-4">{userData.name}</h2> {/* Increased text size */}
            <p className="text-gray-500 text-lg">{userData.email}</p> {/* Increased text size */}
          </div>

          {/* Profile Details Form */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['name', 'userName', 'email', 'password', 'dob', 'hallticket', 'pan', 'aadhar', 'mentor', 'phone'].map((field, index) => (
                <div key={index} className="relative">
                  <label className="text-gray-500 text-lg absolute top-0 left-3 -translate-y-6 scale-75 origin-left transform peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 transition-all">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={userData[field]}
                    onChange={handleInputChange}
                    className="mt-1 peer block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all placeholder-transparent text-lg" /* Increased input text size */
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
