import React, { useState } from 'react';

const Settings = () => {
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation

    const handleTwoFactorToggle = () => {
        setIsTwoFactorEnabled(!isTwoFactorEnabled);
    };

    const handleSave = () => {
        // Handle save logic here
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        alert("Settings saved!");
    };

    return (
        <div className="flex-grow h-screen px-8 py-8 bg-gray-100 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Security</h2>

                {/* Two-factor Authentication Toggle */}
                <div className="mb-6">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>Two-factor Authentication</span>
                        <div
                            onClick={handleTwoFactorToggle}
                            className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 ${
                                isTwoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                    isTwoFactorEnabled ? 'translate-x-7' : 'translate-x-0'
                                }`}
                            ></div>
                        </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Enable or disable two-factor authentication</p>
                </div>

                {/* Change Password Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Change Password</h3>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-1/2 px-2 py-1 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-half"
                    />
                    
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">New Password</h3>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-1/2 px-2 py-1 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-half"
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 text-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
