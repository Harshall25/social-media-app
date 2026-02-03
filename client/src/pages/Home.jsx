import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import { mediaAPI } from '../api/media';
import { usersAPI } from '../api/users';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Smile, 
  X,
  Menu,
  LogOut,
  TrendingUp,
  MapPin,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';

// --- Mock Data for Trending & Suggestions (static for now) ---
const TRENDING_TOPICS = [
  { id: 't1', topic: 'Technology', title: 'React 19 Release', posts: '24.5K posts' },
  { id: 't2', topic: 'Design', title: '#UIUX', posts: '18.2K posts' },
  { id: 't3', topic: 'News', title: 'SpaceX Launch', posts: '121K posts' },
  { id: 't4', topic: 'Entertainment', title: 'New Marvel Movie', posts: '56K posts' },
];

const SUGGESTED_USERS = [
  { id: 'su1', name: 'Design Masters', handle: '@design_masters', avatar: 'https://i.pravatar.cc/150?u=design' },
  { id: 'su2', name: 'Code Ninja', handle: '@codeninja', avatar: 'https://i.pravatar.cc/150?u=ninja' },
];

// --- Helper function for time ago ---
const getTimeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return postDate.toLocaleDateString();
};

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white hover:bg-gray-50 text-slate-700 border border-slate-200",
    ghost: "hover:bg-slate-100 text-slate-600",
    danger: "text-red-500 hover:bg-red-50",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Avatar = ({ src, alt, size = 'md' }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-24 h-24 text-4xl",
  };

  const fallbackLetter = alt ? alt.charAt(0).toUpperCase() : 'U';
  
  return src ? (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizes[size]} rounded-full object-cover border border-slate-100 bg-slate-200 flex-shrink-0`}
    />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {fallbackLetter}
    </div>
  );
};

// Helper function to convert R2 URLs to server URLs
const convertImageUrl = (url) => {
  if (!url) return null;
  
  // If it's already a server URL, return as is
  if (url.includes('/api/v1/media/file/')) {
    return url;
  }
  
  // If it's an R2 URL, convert to server URL
  if (url.includes('r2.cloudflarestorage.com') || url.includes('r2.dev')) {
    // Extract the filename from the R2 URL
    const parts = url.split('/');
    const fileName = parts[parts.length - 1]; // Get the last part (filename)
    return `http://localhost:3000/api/v1/media/file/media/${fileName}`;
  }
  
  return url;
};

// --- Main Home Component ---

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [newPostContent, setNewPostContent] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('all'); // 'all', 'posts', 'users', 'tags'
  const [manualTags, setManualTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [feedType, setFeedType] = useState('forYou'); // 'forYou' or 'following'
  const fileInputRef = useRef(null);

  // Current user info
  const CURRENT_USER = {
    id: user?.id || 'u1',
    name: user?.name || 'User',
    handle: `@${user?.email?.split('@')[0] || 'user'}`,
    avatar: null,
    bio: 'Social Media User',
    following: 0,
    followers: 0,
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80'
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts('', feedType);
    fetchTrendingHashtags();
    fetchSuggestedUsers();
    fetchCurrentUserData();
  }, [feedType]); // Add feedType dependency to refetch when feed type changes

  const fetchPosts = async (search = '', feedTypeParam = null) => {
    try {
      setLoading(true);
      const currentFeedType = feedTypeParam !== null ? feedTypeParam : feedType;
      const params = search 
        ? { search, limit: 50 } 
        : { limit: 50, sortBy: 'createdAt', sortOrder: 'desc' };
      
      // Add feedType parameter if it's 'following'
      if (currentFeedType === 'following') {
        params.feedType = 'following';
      }
      
      const response = await postsAPI.getPosts(params);
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingHashtags = async () => {
    try {
      const response = await postsAPI.getTrendingHashtags(10);
      setTrendingHashtags(response.trending || []);
    } catch (error) {
      console.error('Failed to fetch trending hashtags:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await usersAPI.getSuggestedUsers();
      setSuggestedUsers(response.users || []);
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
    }
  };

  const fetchCurrentUserData = async () => {
    try {
      const response = await usersAPI.getCurrentUser();
      setCurrentUserData(response.user);
    } catch (error) {
      console.error('Failed to fetch current user data:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (following.has(userId)) {
        await usersAPI.unfollowUser(userId);
        setFollowing(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await usersAPI.followUser(userId);
        setFollowing(prev => new Set(prev).add(userId));
      }
      // Refresh suggested users and current user data after follow/unfollow
      await fetchSuggestedUsers();
      await fetchCurrentUserData();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts('', feedType);
      setSearchResults({ posts: [], users: [] });
      return;
    }

    try {
      setIsSearching(true);
      
      const [postsResponse, usersResponse] = await Promise.all([
        postsAPI.searchPosts(searchQuery),
        usersAPI.searchUsers(searchQuery)
      ]);

      setSearchResults({
        posts: postsResponse.posts || [],
        users: usersResponse.users || []
      });
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({ posts: [], users: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        await postsAPI.unlikePost(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likesCount: Math.max(0, post.likesCount - 1) }
            : post
        ));
      } else {
        await postsAPI.likePost(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likesCount: post.likesCount + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;

    try {
      setPosting(true);
      
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        console.log('Uploading image:', selectedImage.name);
        const uploadResponse = await mediaAPI.uploadMedia(selectedImage);
        imageUrl = uploadResponse.url;
        console.log('Image uploaded successfully, URL:', imageUrl);
      }

      // Extract hashtags from content and combine with manual tags
      const contentHashtags = newPostContent.match(/#[\w]+/g) || [];
      const extractedTags = contentHashtags.map(tag => tag.slice(1)); // Remove # symbol
      const allTags = [...new Set([...extractedTags, ...manualTags])]; // Remove duplicates

      const postData = {
        content: newPostContent,
        tags: allTags,
        ...(imageUrl && { imageUrl })
      };

      const createResponse = await postsAPI.createPost(postData);
      console.log('Post created:', createResponse);
      
      // Clear form first
      setNewPostContent('');
      setManualTags([]);
      setTagInput('');
      handleRemoveImage();
      
      // Refresh posts and trending
      await fetchPosts('', feedType);
      await fetchTrendingHashtags();
      

    } catch (error) {
      console.error('Failed to create post:', error);
      alert(`Failed to create post: ${error.response?.data?.error || error.message}`);
    } finally {
      setPosting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !manualTags.includes(tagInput.trim())) {
      setManualTags([...manualTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setManualTags(manualTags.filter(tag => tag !== tagToRemove));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ icon: Icon, label, id, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'font-bold text-slate-900 bg-white shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={24} className={isActive ? 'text-blue-500' : 'text-slate-500'} />
      <span className="text-lg hidden xl:block">{label}</span>
    </button>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 100 100">
             <path fill="#78a3cf" d="M15,29c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2	c0,1.104,0.896,2,2,2C14.104,31,15,30.104,15,29z"></path><path fill="#f1b419" d="M78,13c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1	c0,0.552,0.448,1,1,1C77.552,14,78,13.552,78,13z"></path><path fill="#cee1f4" d="M87,50c0-20.424-16.576-37-37-37c-20.424,0-37,16.576-37,37	s16.576,37,37,37C70.424,87,87,70.424,87,50z"></path><path fill="#f1b419" d="M87,15c0-2.208-1.792-4-4-4c-2.208,0-4,1.792-4,4s1.792,4,4,4	C85.208,19,87,17.208,87,15z"></path><path fill="#78a3cf" d="M89,24c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2	c0,1.104,0.896,2,2,2C88.104,26,89,25.104,89,24z"></path><path fill="#fbcd59" d="M83,76c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2s0.896,2,2,2	C82.104,78,83,77.104,83,76z"></path><path fill="#fbcd59" d="M19,63c0-2.208-1.792-4-4-4c-2.208,0-4,1.792-4,4s1.792,4,4,4	C17.208,67,19,65.208,19,63z"></path><path fill="#78a3cf" d="M27,87c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2s0.896,2,2,2	C26.104,89,27,88.104,27,87z"></path><path fill="#fff" d="M21,53.5c0-1.38-1.12-2.5-2.5-2.5c-1.38,0-2.5,1.12-2.5,2.5	s1.12,2.5,2.5,2.5C19.88,56,21,54.88,21,53.5z"></path><path fill="#f1b419" d="M22,67c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1s0.448,1,1,1	C21.552,68,22,67.552,22,67z"></path><path fill="#fff" d="M81,34c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1s0.448,1,1,1	C80.552,35,81,34.552,81,34z"></path><path fill="#a1a1ca" d="M41.884,74.296c-1.028,0-1.985-0.257-2.869-0.773	c-0.884-0.515-1.327-1.288-1.327-2.317V30.249c0-1.073,0.504-1.847,1.512-2.319c1.008-0.472,2.108-0.708,3.301-0.708	c1.193,0,2.293,0.236,3.301,0.708c1.008,0.472,1.512,1.245,1.512,2.319v35.289h14.068c0.947,0,1.645,0.451,2.099,1.352	c0.452,0.901,0.679,1.911,0.679,3.027c0,1.073-0.227,2.071-0.679,2.995c-0.453,0.923-1.152,1.384-2.099,1.384H41.884z"></path><path fill="#472b29" fillRule="evenodd" d="M38.661,74.128	c-1.101-0.64-1.675-1.645-1.675-2.923V30.249c0-1.357,0.673-2.371,1.916-2.952c1.107-0.519,2.309-0.775,3.599-0.775	c1.288,0,2.491,0.256,3.597,0.775c1.243,0.581,1.916,1.595,1.916,2.952v34.589h13.368c1.232,0,2.161,0.62,2.724,1.739	c0.507,1.008,0.753,2.127,0.753,3.34c0,1.176-0.249,2.28-0.751,3.304c-0.559,1.136-1.485,1.776-2.727,1.776H41.884	C40.732,74.997,39.653,74.708,38.661,74.128z M62.852,72.604c0.403-0.824,0.607-1.715,0.607-2.687c0-1.017-0.207-1.917-0.604-2.712	c-0.344-0.684-0.812-0.965-1.472-0.965H47.315c-0.388,0-0.701-0.313-0.701-0.701V30.249c0-0.788-0.335-1.321-1.108-1.684	c-0.909-0.425-1.907-0.641-3.004-0.641c-1.099,0-2.096,0.216-3.005,0.641c-0.773,0.363-1.108,0.896-1.108,1.684v40.956	c0,0.783,0.312,1.324,0.979,1.713c0.776,0.452,1.612,0.677,2.517,0.677h19.499C62.033,73.596,62.504,73.313,62.852,72.604z" clipRule="evenodd"></path><path fill="#472b29" fillRule="evenodd" d="M44.013,65.539	l-0.001-10.54c0-0.139,0.112-0.251,0.249-0.251c0.139,0,0.251,0.112,0.251,0.249l0.001,10.54c0,1.547,1.255,2.801,2.801,2.801H55	c0.137,0,0.249,0.112,0.249,0.249c0,0.139-0.112,0.251-0.249,0.251h-7.685C45.492,68.839,44.013,67.36,44.013,65.539z M57.751,68.588c0-0.137,0.112-0.249,0.251-0.249h2.869c0.137,0,0.249,0.112,0.249,0.249c0,0.139-0.112,0.251-0.249,0.251h-2.869	C57.863,68.839,57.751,68.727,57.751,68.588z M44.012,50.001V35c0-0.137,0.112-0.249,0.251-0.249c0.137,0,0.249,0.112,0.249,0.249	v15.001c0,0.139-0.112,0.251-0.249,0.251C44.124,50.252,44.012,50.14,44.012,50.001z M44.012,31.999v-1.205l-0.492-0.164	l-0.484-0.077c-0.171-0.019-0.349-0.028-0.535-0.028c-0.188,0-0.367,0.009-0.539,0.028l-0.485,0.077l-0.66,0.221	c-0.131,0.044-0.272-0.027-0.316-0.157c-0.044-0.131,0.027-0.272,0.157-0.316l0.704-0.236c0.355-0.077,0.731-0.117,1.139-0.117	c0.405,0,0.78,0.04,1.151,0.123l0.689,0.231c0.103,0.033,0.171,0.129,0.171,0.236v1.385c0,0.139-0.112,0.251-0.249,0.251	C44.124,32.249,44.012,32.137,44.012,31.999z" clipRule="evenodd"></path>
           </svg>
           <span className="font-bold text-xl text-slate-800">Linkup</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-full">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex justify-center min-h-screen pt-16 lg:pt-0">
        
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-screen lg:w-72 lg:bg-transparent lg:border-none lg:flex lg:flex-col lg:items-end lg:pr-8 lg:py-6
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="w-full max-w-[240px] flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 px-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="44" height="44" viewBox="0 0 100 100">
                <path fill="#78a3cf" d="M15,29c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2	c0,1.104,0.896,2,2,2C14.104,31,15,30.104,15,29z"></path><path fill="#f1b419" d="M78,13c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1	c0,0.552,0.448,1,1,1C77.552,14,78,13.552,78,13z"></path><path fill="#cee1f4" d="M87,50c0-20.424-16.576-37-37-37c-20.424,0-37,16.576-37,37	s16.576,37,37,37C70.424,87,87,70.424,87,50z"></path><path fill="#f1b419" d="M87,15c0-2.208-1.792-4-4-4c-2.208,0-4,1.792-4,4s1.792,4,4,4	C85.208,19,87,17.208,87,15z"></path><path fill="#78a3cf" d="M89,24c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2	c0,1.104,0.896,2,2,2C88.104,26,89,25.104,89,24z"></path><path fill="#fbcd59" d="M83,76c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2s0.896,2,2,2	C82.104,78,83,77.104,83,76z"></path><path fill="#fbcd59" d="M19,63c0-2.208-1.792-4-4-4c-2.208,0-4,1.792-4,4s1.792,4,4,4	C17.208,67,19,65.208,19,63z"></path><path fill="#78a3cf" d="M27,87c0-1.104-0.896-2-2-2c-1.104,0-2,0.896-2,2s0.896,2,2,2	C26.104,89,27,88.104,27,87z"></path><path fill="#fff" d="M21,53.5c0-1.38-1.12-2.5-2.5-2.5c-1.38,0-2.5,1.12-2.5,2.5	s1.12,2.5,2.5,2.5C19.88,56,21,54.88,21,53.5z"></path><path fill="#f1b419" d="M22,67c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1s0.448,1,1,1	C21.552,68,22,67.552,22,67z"></path><path fill="#fff" d="M81,34c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1s0.448,1,1,1	C80.552,35,81,34.552,81,34z"></path><path fill="#a1a1ca" d="M41.884,74.296c-1.028,0-1.985-0.257-2.869-0.773	c-0.884-0.515-1.327-1.288-1.327-2.317V30.249c0-1.073,0.504-1.847,1.512-2.319c1.008-0.472,2.108-0.708,3.301-0.708	c1.193,0,2.293,0.236,3.301,0.708c1.008,0.472,1.512,1.245,1.512,2.319v35.289h14.068c0.947,0,1.645,0.451,2.099,1.352	c0.452,0.901,0.679,1.911,0.679,3.027c0,1.073-0.227,2.071-0.679,2.995c-0.453,0.923-1.152,1.384-2.099,1.384H41.884z"></path><path fill="#472b29" fillRule="evenodd" d="M38.661,74.128	c-1.101-0.64-1.675-1.645-1.675-2.923V30.249c0-1.357,0.673-2.371,1.916-2.952c1.107-0.519,2.309-0.775,3.599-0.775	c1.288,0,2.491,0.256,3.597,0.775c1.243,0.581,1.916,1.595,1.916,2.952v34.589h13.368c1.232,0,2.161,0.62,2.724,1.739	c0.507,1.008,0.753,2.127,0.753,3.34c0,1.176-0.249,2.28-0.751,3.304c-0.559,1.136-1.485,1.776-2.727,1.776H41.884	C40.732,74.997,39.653,74.708,38.661,74.128z M62.852,72.604c0.403-0.824,0.607-1.715,0.607-2.687c0-1.017-0.207-1.917-0.604-2.712	c-0.344-0.684-0.812-0.965-1.472-0.965H47.315c-0.388,0-0.701-0.313-0.701-0.701V30.249c0-0.788-0.335-1.321-1.108-1.684	c-0.909-0.425-1.907-0.641-3.004-0.641c-1.099,0-2.096,0.216-3.005,0.641c-0.773,0.363-1.108,0.896-1.108,1.684v40.956	c0,0.783,0.312,1.324,0.979,1.713c0.776,0.452,1.612,0.677,2.517,0.677h19.499C62.033,73.596,62.504,73.313,62.852,72.604z" clipRule="evenodd"></path><path fill="#472b29" fillRule="evenodd" d="M44.013,65.539	l-0.001-10.54c0-0.139,0.112-0.251,0.249-0.251c0.139,0,0.251,0.112,0.251,0.249l0.001,10.54c0,1.547,1.255,2.801,2.801,2.801H55	c0.137,0,0.249,0.112,0.249,0.249c0,0.139-0.112,0.251-0.249,0.251h-7.685C45.492,68.839,44.013,67.36,44.013,65.539z M57.751,68.588c0-0.137,0.112-0.249,0.251-0.249h2.869c0.137,0,0.249,0.112,0.249,0.249c0,0.139-0.112,0.251-0.249,0.251h-2.869	C57.863,68.839,57.751,68.727,57.751,68.588z M44.012,50.001V35c0-0.137,0.112-0.249,0.251-0.249c0.137,0,0.249,0.112,0.249,0.249	v15.001c0,0.139-0.112,0.251-0.249,0.251C44.124,50.252,44.012,50.14,44.012,50.001z M44.012,31.999v-1.205l-0.492-0.164	l-0.484-0.077c-0.171-0.019-0.349-0.028-0.535-0.028c-0.188,0-0.367,0.009-0.539,0.028l-0.485,0.077l-0.66,0.221	c-0.131,0.044-0.272-0.027-0.316-0.157c-0.044-0.131,0.027-0.272,0.157-0.316l0.704-0.236c0.355-0.077,0.731-0.117,1.139-0.117	c0.405,0,0.78,0.04,1.151,0.123l0.689,0.231c0.103,0.033,0.171,0.129,0.171,0.236v1.385c0,0.139-0.112,0.251-0.249,0.251	C44.124,32.249,44.012,32.137,44.012,31.999z" clipRule="evenodd"></path>
              </svg>
              <span className="font-bold text-2xl text-slate-800">Linkup</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-2 lg:px-0">
              <NavItem icon={Home} label="Home" id="home" isActive={activeTab === 'home'} onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} />
              <NavItem icon={Search} label="Explore" id="explore" isActive={activeTab === 'explore'} onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }} />
              <NavItem icon={Bell} label="Notifications" id="notifications" isActive={activeTab === 'notifications'} onClick={() => { setActiveTab('notifications'); setIsMobileMenuOpen(false); }} />
              <NavItem icon={Mail} label="Messages" id="messages" isActive={activeTab === 'messages'} onClick={() => { setActiveTab('messages'); setIsMobileMenuOpen(false); }} />
              <NavItem icon={User} label="Profile" id="profile" isActive={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} />
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                 <button 
                   onClick={handleLogout}
                   className="flex items-center gap-4 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl"
                 >
                    <LogOut size={24} />
                    <span className="text-lg">Logout</span>
                 </button>
              </div>
            </nav>

            {/* User Mini Profile (Bottom of Sidebar) */}
            <div className="hidden lg:flex items-center gap-3 p-3 rounded-full hover:bg-white hover:shadow-md transition-all cursor-pointer mt-auto bg-slate-100/50">
              <Avatar src={CURRENT_USER.avatar} alt={CURRENT_USER.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{CURRENT_USER.name}</p>
                <p className="text-xs text-slate-500 truncate">{CURRENT_USER.handle}</p>
              </div>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="w-full lg:w-[600px] min-h-screen border-x border-slate-200/60 bg-white">
          
          {/* Create Post Widget */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex gap-4">
              <div className="hidden sm:block">
                 <Avatar src={CURRENT_USER.avatar} alt={CURRENT_USER.name} size="lg" />
              </div>
              <div className="flex-1">
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's happening?" 
                  className="w-full text-lg placeholder-slate-400 border-none focus:ring-0 resize-none h-24 bg-transparent"
                />
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-h-80 object-cover rounded-2xl border border-slate-200"
                    />
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                {/* Tags Section */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {manualTags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tags (press Enter)"
                      className="flex-1 text-sm px-3 py-1 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button 
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {(newPostContent || imagePreview || manualTags.length > 0) && (
                  <div className="pb-2">
                    <div className="h-px bg-slate-100 mb-2" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-blue-500">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><Smile size={20} /></button>
                    <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><MapPin size={20} /></button>
                  </div>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={(!newPostContent.trim() && !selectedImage) || posting}
                    className={(!newPostContent.trim() && !selectedImage) || posting ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {posting ? <Loader2 size={18} className="animate-spin" /> : null}
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="divide-y divide-slate-100">
             {activeTab === 'profile' ? (
                <ProfileView user={{
                  ...CURRENT_USER,
                  ...currentUserData,
                  handle: currentUserData ? `@${currentUserData.email?.split('@')[0]}` : CURRENT_USER.handle
                }} posts={posts.filter(p => p.author?._id === (currentUserData?.id || CURRENT_USER.id))} onLike={handleLike} likedPosts={likedPosts} />
             ) : activeTab === 'explore' ? (
                <ExploreView 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSearch={handleSearch}
                  onSearchKeyPress={handleSearchKeyPress}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  onLike={handleLike}
                  likedPosts={likedPosts}
                />
             ) : (
               <>
                 <div className="sticky top-16 lg:top-0 bg-white/80 backdrop-blur-sm z-30 px-4 py-3 border-b border-slate-100 flex justify-around">
                    <button 
                      className={`font-bold relative ${feedType === 'forYou' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                      onClick={() => {
                        setFeedType('forYou');
                        fetchPosts('', 'forYou');
                      }}
                    >
                      For You
                      {feedType === 'forYou' && <div className="absolute -bottom-3 left-0 right-0 h-1 bg-blue-500 rounded-full" />}
                    </button>
                    <button 
                      className={`font-medium relative ${feedType === 'following' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                      onClick={() => {
                        setFeedType('following');
                        fetchPosts('', 'following');
                      }}
                    >
                      Following
                      {feedType === 'following' && <div className="absolute -bottom-3 left-0 right-0 h-1 bg-blue-500 rounded-full" />}
                    </button>
                 </div>
                 
                 {loading ? (
                   <div className="flex items-center justify-center py-12">
                     <Loader2 size={32} className="animate-spin text-blue-500" />
                   </div>
                 ) : posts.length === 0 ? (
                   <div className="p-8 text-center text-slate-500">
                     No posts yet. Be the first to post!
                   </div>
                 ) : (
                   posts.map((post) => (
                      <PostCard 
                        key={post._id} 
                        post={post} 
                        onLike={() => handleLike(post._id)} 
                        isLiked={likedPosts.has(post._id)}
                      />
                   ))
                 )}
               </>
             )}
          </div>
        </main>

        {/* RIGHT WIDGETS (Desktop) */}
        <aside className="hidden lg:block w-[350px] pl-8 py-6 space-y-6">
          
          {/* Search */}
          <div className="sticky top-0 bg-slate-50 pb-2 z-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400 group-focus-within:text-blue-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search Linkup" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveTab('explore');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTab('explore');
                    handleSearch();
                  }
                }}
                className="block w-full pl-10 pr-3 py-3 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* Trending Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-100">
               <h2 className="font-bold text-xl text-slate-800">Trends for you</h2>
             </div>
             {trendingHashtags.length > 0 ? trendingHashtags.map((trend, index) => (
               <div 
                 key={index} 
                 className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer relative"
                 onClick={() => {
                   setSearchQuery(`#${trend.hashtag}`);
                   setActiveTab('explore');
                   handleSearch();
                 }}
               >
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Trending in Linkup</p>
                      <p className="font-bold text-slate-800 mt-0.5">#{trend.hashtag}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{trend.count} posts</p>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400">
                      <MoreHorizontal size={16} />
                    </button>
                 </div>
               </div>
             )) : (
               <div className="px-4 py-8 text-center text-slate-500">
                 <p>No trending hashtags yet</p>
                 <p className="text-sm mt-1">Be the first to create posts with hashtags!</p>
               </div>
             )}
             <div className="p-4">
               <button className="text-blue-500 text-sm font-medium hover:underline">Show more</button>
             </div>
          </div>

          {/* Who to follow */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-100">
               <h2 className="font-bold text-xl text-slate-800">Who to follow</h2>
             </div>
             {suggestedUsers.length > 0 ? suggestedUsers.map((suggestedUser) => (
               <div key={suggestedUser._id} className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3">
                 <Avatar src={`https://i.pravatar.cc/150?u=${suggestedUser._id}`} alt={suggestedUser.name} size="md" />
                 <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{suggestedUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{suggestedUser.email.split('@')[0]}</p>
                 </div>
                 <Button 
                   variant="secondary" 
                   className="px-3 py-1 text-sm h-8"
                   onClick={() => handleFollow(suggestedUser._id)}
                 >
                   {following.has(suggestedUser._id) ? 'Following' : 'Follow'}
                 </Button>
               </div>
             )) : (
               <div className="px-4 py-8 text-center text-slate-500">
                 <p>No suggestions available</p>
                 <p className="text-sm mt-1">More users will appear as they join!</p>
               </div>
             )}
          </div>

          {/* Footer Links */}
          <div className="px-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads Info</a>
            <span>© 2024 Linkup Inc.</span>
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- Sub-Components ---

const PostCard = ({ post, onLike, isLiked }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  
  const authorName = post.author?.name || 'Unknown User';
  const authorHandle = post.author?.email ? `@${post.author.email.split('@')[0]}` : '@user';

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await postsAPI.getComments(post._id);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setPostingComment(true);
      await postsAPI.addComment(post._id, newComment);
      setNewComment('');
      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setPostingComment(false);
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  return (
    <article className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100/50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Avatar src={null} alt={authorName} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
               <span className="font-bold text-slate-900 truncate">{authorName}</span>
               <span className="text-slate-500 text-sm truncate">{authorHandle}</span>
               <span className="text-slate-400 text-xs flex-shrink-0">· {getTimeAgo(post.createdAt)}</span>
            </div>
            <button className="text-slate-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          {post.title && (
            <h3 className="mt-1 font-semibold text-slate-900">{post.title}</h3>
          )}
          
          <div className="mt-1 text-slate-800 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200">
              <img 
                src={convertImageUrl(post.imageUrl)} 
                alt="Post content" 
                className="w-full h-auto object-cover max-h-[500px]" 
                onError={(e) => {
                  console.error('Image failed to load:', convertImageUrl(post.imageUrl));
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully:', convertImageUrl(post.imageUrl))}
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-blue-500 text-sm hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery(`#${tag}`);
                    setActiveTab('explore');
                    // Trigger search after state update
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-slate-500 max-w-md">
            <button 
              onClick={handleShowComments}
              className="flex items-center gap-2 group transition-all text-slate-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full"
            >
              <MessageCircle size={18} />
              <span className="text-xs font-medium">{comments.length || 0}</span>
            </button>
            <ActionIcon 
              icon={Share2} 
              color="hover:text-green-500 hover:bg-green-50" 
            />
            <ActionIcon 
              icon={Heart} 
              count={post.likesCount || 0} 
              isActive={isLiked} 
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              color={isLiked ? "text-pink-600" : "hover:text-pink-600 hover:bg-pink-50"} 
              fill={isLiked}
            />
            <ActionIcon 
              icon={TrendingUp} 
              color="hover:text-blue-500 hover:bg-blue-50" 
            />
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              {/* Add Comment */}
              <div className="flex gap-3 mb-4">
                <Avatar src={null} alt="You" size="sm" />
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 text-sm rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || postingComment}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {postingComment ? <Loader2 size={14} className="animate-spin" /> : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {loadingComments ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-blue-500" />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <Avatar 
                        src={null} 
                        alt={comment.user?.name || 'User'} 
                        size="sm" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">
                            {comment.user?.name || 'User'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const ActionIcon = ({ icon: Icon, count, isActive, onClick, color, fill }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 group transition-all ${isActive ? '' : 'text-slate-500'}`}
  >
    <div className={`p-2 rounded-full transition-colors ${color}`}>
      <Icon size={18} className={`${fill ? 'fill-current' : ''}`} />
    </div>
    {count !== undefined && (
      <span className={`text-xs font-medium group-hover:text-opacity-80 ${color && !color.includes('hover') ? color : 'group-hover:text-slate-800'}`}>
        {count}
      </span>
    )}
  </button>
);

const ExploreView = ({ searchQuery, setSearchQuery, onSearch, onSearchKeyPress, searchResults, isSearching, onLike, likedPosts }) => {
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch();
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div>
      {/* Search Header */}
      <div className="sticky top-16 lg:top-0 bg-white/80 backdrop-blur-sm z-30 px-4 py-4 border-b border-slate-100">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search posts, users, or hashtags..."
              className="block w-full pl-10 pr-12 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              onClick={onSearch}
              disabled={isSearching}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-4 py-4">
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : searchQuery && (searchResults.posts.length > 0 || searchResults.users.length > 0) ? (
          <div className="space-y-6">
            {/* Users Section */}
            {searchResults.users.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Users</h3>
                <div className="space-y-3">
                  {searchResults.users.map((user) => (
                    <div key={user._id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                      <Avatar src={null} alt={user.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-sm text-slate-500 truncate">@{user.email.split('@')[0]}</p>
                      </div>
                      <Button variant="secondary" className="px-4 py-1 text-sm">Follow</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {searchResults.posts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Posts</h3>
                <div className="space-y-4">
                  {searchResults.posts.map((post) => (
                    <PostCard 
                      key={post._id} 
                      post={post} 
                      onLike={() => onLike(post._id)} 
                      isLiked={likedPosts.has(post._id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No results found for "{searchQuery}"</p>
            <p className="text-slate-400 text-sm mt-2">Try searching for different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Search for posts, topics, or users</p>
            <p className="text-slate-400 text-sm mt-2">Start typing to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileView = ({ user, posts, onLike, likedPosts }) => {
  return (
    <div className="pb-8">
      {/* Cover Image */}
      <div className="h-48 bg-slate-200 relative">
        <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
        <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm">
          <ImageIcon size={20} />
        </button>
      </div>
      
      {/* Profile Header */}
      <div className="px-4 relative">
        <div className="flex justify-between items-start">
           <div className="-mt-16 mb-3">
             <div className="p-1 bg-white rounded-full inline-block">
               <Avatar src={user.avatar} alt={user.name} size="xl" />
             </div>
           </div>
           <div className="mt-4">
             <Button variant="secondary" className="font-bold rounded-full border-slate-300">Edit Profile</Button>
           </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-500">{user.handle}</p>
        </div>
        
        <p className="mt-4 text-slate-700 leading-relaxed">
          {user.bio}
        </p>
        
        <div className="mt-4 flex gap-6 text-sm">
           <div className="flex gap-1 hover:underline cursor-pointer">
             <span className="font-bold text-slate-900">{user.following}</span>
             <span className="text-slate-500">Following</span>
           </div>
           <div className="flex gap-1 hover:underline cursor-pointer">
             <span className="font-bold text-slate-900">{user.followers}</span>
             <span className="text-slate-500">Followers</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mt-6">
         <button className="flex-1 py-4 text-center font-bold text-slate-900 border-b-4 border-blue-500 hover:bg-slate-50">Posts</button>
         <button className="flex-1 py-4 text-center font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">Replies</button>
         <button className="flex-1 py-4 text-center font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">Media</button>
         <button className="flex-1 py-4 text-center font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">Likes</button>
      </div>

      {/* User Posts */}
      <div className="divide-y divide-slate-100">
        {posts.length > 0 ? posts.map(post => (
           <PostCard key={post._id} post={post} onLike={() => onLike(post._id)} isLiked={likedPosts.has(post._id)} />
        )) : (
          <div className="p-8 text-center text-slate-500">
             No posts yet.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function defined at the top level
const getTimeAgo_helper = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return postDate.toLocaleDateString();
};
