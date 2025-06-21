import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CalligraphyGenerator from './components/CalligraphyGenerator';
import WallPreview from './components/WallPreview';
import CanvasEditor from './components/CanvasEditor';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Pricing from './components/Pricing';
import { useGoogleApis } from './hooks/useGoogleApis';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { hasActiveSubscription } from './services/subscriptionService';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const { user, loading: authLoading, signOut } = useSupabaseAuth();
  const [hasActiveSubscriptionState, setHasActiveSubscriptionState] = useState(false);
  const { isInitialized, error } = useGoogleApis();

  useEffect(() => {
    if (user) {
      hasActiveSubscription(user.id).then(setHasActiveSubscriptionState);
    } else {
      setHasActiveSubscriptionState(false);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      console.error('Google APIs initialization error:', error);
    }
  }, [error]);

  const renderSection = () => {
    const authProtected = ['calligraphy', 'preview', 'editor', 'profile', 'pricing'];
    const subscriptionProtected = ['calligraphy', 'preview', 'editor'];

    if (authLoading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (authProtected.includes(activeSection) && !user) {
      return <Login setActiveSection={setActiveSection} />;
    }

    if (subscriptionProtected.includes(activeSection) && !hasActiveSubscriptionState) {
      return (
        <Pricing
          user={user ? { email: user.email, name: user.email } : { email: '', name: '' }}
          onPaymentSuccess={() => {
            setHasActiveSubscriptionState(true);
            setActiveSection('calligraphy');
          }}
        />
      );
    }

    switch (activeSection) {
      case 'home':
        return <HeroSection setActiveSection={setActiveSection} />;
      case 'calligraphy':
        return <CalligraphyGenerator />;
      case 'preview':
        return <WallPreview />;
      case 'editor':
        return <CanvasEditor />;
      case 'login':
        return <Login setActiveSection={setActiveSection} />;
      case 'register':
        return <Register setActiveSection={setActiveSection} />;
      case 'profile':
        return <Profile onLogout={() => { signOut(); setActiveSection('home'); }} />;
      case 'pricing':
        return (
          <Pricing
            user={user ? { email: user.email, name: user.email } : { email: '', name: '' }}
            onPaymentSuccess={() => {
              setHasActiveSubscriptionState(true);
              setActiveSection('calligraphy');
            }}
          />
        );
      default:
        return <HeroSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isAuthenticated={!!user}
        hasActiveSubscription={hasActiveSubscriptionState}
        onLogout={() => { signOut(); setActiveSection('home'); }}
      />
      <main className="pt-20">
        {!isInitialized && (
          <div className="fixed top-20 left-0 right-0 bg-primary-100 text-primary-800 text-center py-2 z-40">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              Initializing Google AI Services...
            </div>
          </div>
        )}
        {renderSection()}
      </main>
    </div>
  );
}

export default App;