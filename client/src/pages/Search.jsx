import { useState } from 'react';
import { Search as SearchIcon, User, Hash, Users } from 'lucide-react';

export function Search() {
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            // Simulate search API call
            setTimeout(() => {
                if (activeTab === 'users') {
                    setSearchResults([
                        { id: 1, name: 'John Doe', username: 'johndoe', followers: 150 },
                        { id: 2, name: 'Jane Smith', username: 'janesmith', followers: 89 },
                        { id: 3, name: 'Mike Johnson', username: 'mikej', followers: 234 },
                    ]);
                } else {
                    setSearchResults([
                        { id: 1, tag: 'technology', posts: 1542 },
                        { id: 2, tag: 'coding', posts: 987 },
                        { id: 3, tag: 'webdev', posts: 756 },
                    ]);
                }
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Search failed:', error);
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'users', label: 'Users', icon: User },
        { id: 'hashtags', label: 'Hashtags', icon: Hash },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
                    <p className="text-gray-400">Discover users and trending hashtags</p>
                </div>

                {/* Search Container */}
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                    {/* Tabs */}
                    <div className="flex mb-6 border-b border-gray-700">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => {
                                    setActiveTab(id);
                                    setSearchResults([]);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                                    activeTab === id
                                        ? 'text-orange-500 border-orange-500'
                                        : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    activeTab === 'users'
                                        ? 'Search for users...'
                                        : 'Search for hashtags...'
                                }
                                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Searching...</p>
                        </div>
                    )}

                    {/* Search Results */}
                    {!loading && searchResults.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {activeTab === 'users' ? 'Users' : 'Hashtags'}
                            </h3>
                            
                            {activeTab === 'users' ? (
                                <div className="grid gap-4">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">{user.name}</h4>
                                                    <p className="text-gray-400">@{user.username}</p>
                                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {user.followers} followers
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                                                Follow
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {searchResults.map((hashtag) => (
                                        <div
                                            key={hashtag.id}
                                            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white">
                                                    <Hash className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">#{hashtag.tag}</h4>
                                                    <p className="text-gray-400">{hashtag.posts} posts</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && searchQuery && searchResults.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    {/* Initial State */}
                    {!searchQuery && searchResults.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">Start your search</p>
                            <p className="text-gray-500">
                                {activeTab === 'users' 
                                    ? 'Find and connect with other users'
                                    : 'Discover trending hashtags and topics'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}