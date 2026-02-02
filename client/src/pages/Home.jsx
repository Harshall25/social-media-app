import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { Loader, Terminal, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            fetchPosts();
        }
    }, [token]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">Loading feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
                {/* Feed Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Your Feed</h1>
                    <p className="text-gray-400 mb-6">Latest posts from your network</p>
                    
                    {/* <Link 
                        to="/newpost"
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Post
                    </Link> */}
                </div>
                
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
                            <p className="text-gray-400 text-lg mb-2">No posts found in feed</p>
                            <p className="text-gray-500 mb-6">Be the first to share something!</p>
                            <Link 
                                to="/newpost" 
                                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create Post
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} onLike={fetchPosts} />
                        ))}
                        
                        {/* Load More Button */}
                        <div className="text-center py-8">
                            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors">
                                Load More Posts
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}