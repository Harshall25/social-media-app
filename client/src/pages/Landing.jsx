import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, TrendingUp, Star, Zap } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Logo } from '../components/ui/Logo';
import { FeatureCard } from '../components/ui/FeatureCard';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';

export function Landing() {
    return (
        <PageLayout>
            {/* Navigation */}
            <nav className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Logo />
                        
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/login"
                                className="text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 px-6 py-3 rounded-xl smooth-transition font-medium"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup"
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-3 rounded-xl smooth-transition font-medium inline-flex items-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-6 py-24 text-center relative z-10">
                <div className="slide-up">
                    <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                        Connect. Share.
                        <br />
                        <span className="gradient-text">Linkup</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        The modern social platform where meaningful connections happen. 
                        Share your world, discover new perspectives, and build lasting relationships.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            to="/signup"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-4 text-lg rounded-xl smooth-transition font-medium inline-flex items-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
                        >
                            <span>Join Linkup</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link 
                            to="/login"
                            className="glass-card text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 px-8 py-4 text-lg rounded-xl smooth-transition font-medium hover-lift"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-20 slide-up">
                    <h2 className="text-5xl font-bold mb-6">
                        Why Choose <span className="gradient-text">Linkup</span>?
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Built for the modern world with features that matter.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={MessageSquare}
                        title="Rich Conversations"
                        description="Share your thoughts with rich media support, reactions, and threaded discussions."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={TrendingUp}
                        title="Smart Discovery"
                        description="Discover content and people that matter to you with our intelligent recommendation system."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Lightning Fast"
                        description="Experience the fastest social platform with real-time updates and seamless interactions."
                        delay={0.3}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <Card className="max-w-4xl mx-auto my-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatCard value="10K+" label="Active Users" delay={0.1} />
                    <StatCard value="1M+" label="Posts Shared" delay={0.2} />
                    <StatCard value="5M+" label="Connections Made" delay={0.3} />
                    <StatCard value="99%" label="User Satisfaction" delay={0.4} />
                </div>
            </Card>

            {/* CTA Section */}
            <div className="text-center py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl blur-3xl"></div>
                <div className="relative z-10 scale-in">
                    <h2 className="text-5xl font-bold mb-6">
                        Ready to <span className="gradient-text">Connect</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already building meaningful connections on Linkup.
                    </p>
                    <Link 
                        to="/signup"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-10 py-5 text-xl rounded-xl smooth-transition font-medium inline-flex items-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
                    >
                        <span>Start Connecting</span>
                        <Star className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="glass border-t border-white/10 py-8">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <Logo className="justify-center mb-4" />
                    <p className="text-gray-400">
                        © 2026 Linkup. Connecting the world, one conversation at a time.
                    </p>
                </div>
            </footer>
        </PageLayout>
    );
}


