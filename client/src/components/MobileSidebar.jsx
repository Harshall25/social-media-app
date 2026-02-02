import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, PlusCircle, User, Settings, X } from 'lucide-react';

export function MobileSidebar({ isOpen, onClose }) {
    const { token } = useContext(AuthContext);
    const location = useLocation();

    // Don't show sidebar if not logged in
    if (!token) return null;

    const sidebarLinks = [
        { to: '/search', icon: Search, label: 'Search' },
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/newpost', icon: PlusCircle, label: 'Create Post' },
        { to: '/profile', icon: User, label: 'Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActiveLink = (path) => location.pathname === path;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 z-50 md:hidden ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Menu</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {sidebarLinks.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActiveLink(to)
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}