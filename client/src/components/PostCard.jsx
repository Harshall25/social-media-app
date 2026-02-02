import { useState, useContext } from 'react';
import { Heart, MessageCircle, Share2, User, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export function PostCard({ post, onLike, onComment }) {
    const { token } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

    const handleLike = async () => {
        try {
            if (liked) {
                await axios.delete(`http://localhost:3000/posts/${post._id}/like`);
                setLikeCount(prev => prev - 1);
            } else {
                await axios.post(`http://localhost:3000/posts/${post._id}/like`);
                setLikeCount(prev => prev + 1);
            }
            setLiked(!liked);
            if (onLike) onLike(post._id);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    return (
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 mb-6 overflow-hidden">
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    <User className="w-6 h-6" />
                </div>
                <div className="ml-4">
                    <p className="font-bold text-white">{post.author?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
                <div className="text-white leading-relaxed">
                    {post.content}
                </div>
            </div>

            {/* Media */}
            {post.media && (
                <div className="mx-4 mb-4">
                    <img 
                        src={post.media} 
                        alt="Post media" 
                        className="w-full rounded-lg border border-gray-700"
                    />
                </div>
            )}

            {/* Engagement Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-t border-gray-700">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                        liked 
                            ? 'text-red-400 bg-red-500/20' 
                            : 'text-gray-400 hover:text-red-400'
                    }`}
                >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors px-3 py-2 rounded">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments?.length || 0}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors px-3 py-2 rounded">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                </button>
      </div>
    </div>
  );
}
