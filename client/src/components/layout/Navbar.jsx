import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Home, PlusCircle, LogOut, LogIn, Search, Menu } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { MobileSidebar } from '../MobileSidebar';

export function Navbar() {
    const { token, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Don't show navbar on landing, login, or signup pages
    if (['/landing', '/login', '/signup', '/'].includes(location.pathname)) {
        return null;
    }

    return (
        <>
            <nav className="glass sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            {token && (
                                <button
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className="md:hidden text-gray-300 hover:text-white transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            )}
                            <Logo to="/home" />
                        </div>

                    {token ? (
                        <div className="flex items-center space-x-6">
                            {/* Search Bar */}
                            <Link to="/search" className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <div className="bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 hover:border-orange-500 transition-colors w-64 cursor-pointer">
                                    Search users or hashtags...
                                </div>
                            </Link>
                            
                            <Link 
                                to="/home" 
                                className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium hidden lg:inline">Home</span>
                            </Link>
                            
                            <Link 
                                to="/newpost"
                                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 text-sm rounded-lg transition-colors font-medium inline-flex items-center gap-2 hidden md:flex"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create
                            </Link>
                            
                            <button
                                onClick={logout}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 text-sm rounded-lg transition-colors font-medium inline-flex items-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login"
                            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-4 py-2 text-sm rounded-xl transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            <span className="hidden md:inline">Login</span>
                        </Link>
                    )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <MobileSidebar 
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
        </>
    );
}                  