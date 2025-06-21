import React from 'react';
import { Palette, Menu, Globe, User, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, isAuthenticated, hasActiveSubscription, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'calligraphy', label: 'Calligraphy', icon: null, requiresSubscription: true },
    { id: 'preview', label: 'Wall Preview', icon: null, requiresSubscription: true },
    { id: 'editor', label: 'Canvas', icon: null, requiresSubscription: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-gold-500 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-gold-600 bg-clip-text text-transparent">
                Inksoul
              </h1>
              <p className="text-xs text-ink-500 -mt-1">AI Calligraphy</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isDisabled = item.requiresSubscription && !hasActiveSubscription;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveSection('pricing')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'pricing'
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'profile'
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Profile
                </button>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button onClick={() => setActiveSection('login')} className="flex items-center text-ink-600 hover:text-primary-600 transition-colors">
                  <LogIn className="w-5 h-5 mr-1" />
                  Login
                </button>
                <button onClick={() => setActiveSection('register')} className="hidden md:flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Register
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setActiveSection('profile')} className="p-2 text-ink-600 hover:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <button onClick={onLogout} className="flex items-center text-ink-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            )}
            <button className="md:hidden p-2 text-ink-600 hover:text-primary-600 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;