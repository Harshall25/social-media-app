import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Users, UserPlus, Edit2, Save, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export function Profile() {
    const { userId } = useParams();
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        location: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            // Simulate profile data since we don't have real user profile API
            const mockProfile = {
                _id: userId || '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                bio: 'Web developer passionate about creating amazing user experiences.',
                location: 'San Francisco, CA',
                followers: 245,
                following: 189,
                posts: 42,
                joinedDate: '2023-01-15'
            };
            setProfile(mockProfile);
            setEditForm({
                name: mockProfile.name,
                bio: mockProfile.bio,
                location: mockProfile.location
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset form to original values
            setEditForm({
                name: profile.name,
                bio: profile.bio,
                location: profile.location
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            // Simulate API update
            setProfile({ ...profile, ...editForm });
            setIsEditing(false);
            // In real app: await axios.put(`http://localhost:3000/users/profile`, editForm);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const isOwnProfile = true; // In real app: check if current user is viewing their own profile

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                <div className="text-center relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                    <p className="text-gray-400">This user profile doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                {/* Profile Header */}
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-8 mb-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                <User className="w-12 h-12" />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-2xl font-bold bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full"
                                        />
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            placeholder="Location"
                                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                                        <p className="text-gray-400 mb-3">{profile.bio}</p>
                                        {profile.location && (
                                            <p className="text-gray-500 text-sm">{profile.location}</p>
                                        )}
                                        <p className="text-gray-500 text-sm">
                                            Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long' 
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {isOwnProfile && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleEditToggle}
                                                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEditToggle}
                                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    )}
                                </>
                            )}
                            {!isOwnProfile && (
                                <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                                    <UserPlus className="w-4 h-4" />
                                    Follow
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-6 pt-6 border-t border-gray-700">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{profile.posts}</div>
                            <div className="text-gray-400 text-sm">Posts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{profile.followers}</div>
                            <div className="text-gray-400 text-sm">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{profile.following}</div>
                            <div className="text-gray-400 text-sm">Following</div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Posts</h2>
                    <div className="text-center py-8">
                        <p className="text-gray-400">No posts yet</p>
                        {isOwnProfile && (
                            <p className="text-gray-500 text-sm mt-2">Share your first post to get started!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
                        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name?.[0]?.toUpperCase() || 'U'}
                        </div>
}
