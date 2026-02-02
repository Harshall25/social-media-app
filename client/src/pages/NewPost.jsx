import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Image, Send, X, Upload, Hash } from 'lucide-react';

export function NewPost() {
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setMedia(null);
        setMediaPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let mediaUrl = null;

            // Upload media if exists
            if (media) {
                const formData = new FormData();
                formData.append('media', media);
                const mediaResponse = await axios.post('http://localhost:3000/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                mediaUrl = mediaResponse.data.url;
            }

            // Create post
            const postData = {
                content,
                media: mediaUrl
            };
            
            // Add hashtags if provided
            if (hashtags.trim()) {
                postData.hashtags = hashtags.split(',').map(tag => tag.trim().replace('#', '')).filter(tag => tag);
            }
            
            await axios.post('http://localhost:3000/posts/create', postData);

            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Post</h2>
                        <p className="text-gray-400">Share what's on your mind</p>
                    </div>

                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                                <span className="text-red-500">Error:</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    What's on your mind?
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all text-white placeholder-gray-500"
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {content.length} characters
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Hash className="w-4 h-4 inline mr-1" />
                                    Hashtags
                                </label>
                                <input
                                    type="text"
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    placeholder="Add hashtags separated by commas (e.g., technology, coding, webdev)"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">Separate multiple hashtags with commas</p>
                            </div>

                            {/* Media Preview */}
                            {mediaPreview && (
                                <div className="relative bg-gray-800 rounded-lg p-4 border border-gray-600">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-300 text-sm">
                                            Media attached
                                        </span>
                                        <button
                                            type="button"
                                            onClick={removeMedia}
                                            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <img 
                                        src={mediaPreview} 
                                        alt="Preview" 
                                        className="w-full rounded-lg max-h-96 object-cover border border-gray-600"
                                    />
                                </div>
                            )}

                            {/* Media Upload */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-600 hover:border-orange-500 group">
                                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-gray-300 text-sm group-hover:text-orange-500 transition-colors">Add Media</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleMediaChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-gray-500 text-xs">Supports images and videos</span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !content.trim()}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            >
                                {loading ? (
                                    <span className="animate-spin">⚡</span>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Publish Post
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    );
}