import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AuthForm } from '../components/ui/AuthForm';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthForm
                title="Welcome Back"
                subtitle="Sign in to your Linkup account"
                error={error}
                onErrorDismiss={() => setError('')}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        icon={Mail}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="•••••••••"
                        icon={Lock}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        size="lg"
                        className="w-full"
                    >
                        <LogIn className="w-6 h-6" />
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-lg">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-orange-400 hover:text-orange-300 smooth-transition font-semibold flex items-center justify-center gap-2 mt-2">
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </p>
                </div>
            </AuthForm>
        </AuthLayout>
    );
}