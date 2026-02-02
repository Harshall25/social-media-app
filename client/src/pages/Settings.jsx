import { useState } from 'react';
import { Shield, Eye, Lock, Bell, Database, UserCheck } from 'lucide-react';

export function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [privateProfile, setPrivateProfile] = useState(false);
    const [showOnlineStatus, setShowOnlineStatus] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences</p>
                </div>

                {/* Settings Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Privacy Settings */}
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-bold text-white">Privacy</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-white font-medium">Private Profile</p>
                                        <p className="text-gray-400 text-sm">Only approved followers can see your posts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPrivateProfile(!privateProfile)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        privateProfile ? 'bg-orange-600' : 'bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        privateProfile ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-white font-medium">Show Online Status</p>
                                        <p className="text-gray-400 text-sm">Let others see when you're active</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        showOnlineStatus ? 'bg-orange-600' : 'bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-white font-medium">Data Sharing</p>
                                        <p className="text-gray-400 text-sm">Share usage data to improve the platform</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDataSharing(!dataSharing)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        dataSharing ? 'bg-orange-600' : 'bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        dataSharing ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-bold text-white">Notifications</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Push Notifications</p>
                                    <p className="text-gray-400 text-sm">Receive notifications about your activity</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        notifications ? 'bg-orange-600' : 'bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        notifications ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-bold text-white">Account</h2>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <p className="text-white font-medium">Change Password</p>
                                <p className="text-gray-400 text-sm">Update your account password</p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <p className="text-white font-medium">Email Preferences</p>
                                <p className="text-gray-400 text-sm">Manage email notification settings</p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-red-900/50 hover:bg-red-900/70 rounded-lg transition-colors border border-red-500/50">
                                <p className="text-red-400 font-medium">Delete Account</p>
                                <p className="text-red-300/70 text-sm">Permanently delete your account</p>
                            </button>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-bold text-white">App</h2>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <p className="text-white font-medium">Theme</p>
                                <p className="text-gray-400 text-sm">Dark mode (currently active)</p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <p className="text-white font-medium">Language</p>
                                <p className="text-gray-400 text-sm">English (US)</p>
                            </button>

                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <p className="text-white font-medium">About</p>
                                <p className="text-gray-400 text-sm">App version and info</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}