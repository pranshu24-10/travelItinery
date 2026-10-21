import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Compass, Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and a secure password');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await register(email, password, fullName || undefined);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    setErrorMsg('');
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-gray-100/70 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Create an Account</h2>
          <p className="text-xs text-gray-500">Join TravelEase and plan unforgettable AI-crafted journeys.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 text-center space-y-2">
          <span className="text-xs font-semibold text-brand-800 block">Fast-Track Evaluation</span>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleDemoSignIn}
            isLoading={isDemoLoading}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
          >
            Try Demo Account Instantly
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-semibold">Or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name (Optional)"
            placeholder="e.g. Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password *"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create My Account
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
