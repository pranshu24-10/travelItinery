import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  MapPin, 
  Package, 
  Sparkles, 
  BookmarkCheck, 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, logout, loginDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass className="w-4 h-4" /> },
    { name: 'Destinations', path: '/destinations', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Packages', path: '/package', icon: <Package className="w-4 h-4" /> },
    { name: 'Plan Trip', path: '/plan-trip', icon: <Sparkles className="w-4 h-4 text-brand-500" />, highlight: true },
    { name: 'Bookings', path: '/booking', icon: <BookmarkCheck className="w-4 h-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login failed', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="yesteryear-text text-3xl font-bold bg-gradient-to-r from-brand-500 to-rose-600 bg-clip-text text-transparent">
                TravelEase
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 -mt-1.5 ml-0.5">
                AI Trip Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-brand-500 bg-brand-50/80 shadow-sm'
                      : 'text-gray-600 hover:text-brand-500 hover:bg-gray-50'
                  } ${link.highlight && !active ? 'border border-brand-200/60 bg-brand-50/30' : ''}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white px-1.5 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Link to="/plan-trip">
                    <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                      New Trip
                    </Button>
                  </Link>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 hover:border-brand-300 transition-colors bg-gray-50/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                      {user.full_name || user.email.split('@')[0]}
                    </span>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Preferences & Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDemoSignIn}
                  isLoading={isDemoLoading}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Demo Account
                </Button>
                <Link to="/login">
                  <Button size="sm" variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            {!user && (
              <button
                onClick={handleDemoSignIn}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-brand-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'text-brand-500 bg-brand-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile & Preferences</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
