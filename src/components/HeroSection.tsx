import React from 'react';
import { Sparkles, Paintbrush, Eye, Download } from 'lucide-react';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { hasActiveSubscription } from './services/subscriptionService';

interface HeroSectionProps {
  setActiveSection: (section: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setActiveSection }) => {
  const { user } = useSupabaseAuth();
  const [hasSubscription, setHasSubscription] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      hasActiveSubscription(user.id).then(setHasSubscription);
    } else {
      setHasSubscription(false);
    }
  }, [user]);

  const features = [
    {
      icon: Paintbrush,
      title: 'AI Calligraphy Tool',
      description: 'Generate beautiful Brush, Gothic & Arabic calligraphy',
      action: () => setActiveSection('calligraphy'),
    },
    {
      icon: Eye,
      title: 'Wall Preview',
      description: 'Visualize your art on real walls with AR',
      action: () => setActiveSection('preview'),
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Download in multiple formats or save to cloud',
      action: () => setActiveSection('editor'),
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-700 via-primary-600 to-gold-600 bg-clip-text text-transparent mb-6">
            Create Art with AI
          </h1>
          <p className="text-xl md:text-2xl text-ink-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your words into stunning calligraphy using cutting-edge AI technology. 
            From Arabic scripts to modern graffiti, bring your artistic vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveSection('calligraphy')}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Creating
            </button>
            <button
              onClick={() => setActiveSection('preview')}
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
            >
              See Examples
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-primary-100"
              onClick={feature.action}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ink-800 mb-3">{feature.title}</h3>
              <p className="text-ink-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Sample Artwork Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-ink-800 mb-12">Sample Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-gold-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl font-calligraphy text-primary-700">Arabic Script</span>
              </div>
              <h3 className="font-semibold text-ink-800">Traditional Arabic</h3>
              <p className="text-ink-600 text-sm">Naskh & Thuluth Styles</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-ink-100 to-primary-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-ink-700">Gothic Art</span>
              </div>
              <h3 className="font-semibold text-ink-800">Medieval Gothic</h3>
              <p className="text-ink-600 text-sm">Historical Lettering</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-gold-100 to-primary-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl font-calligraphy text-gold-700">Brush Style</span>
              </div>
              <h3 className="font-semibold text-ink-800">Modern Brush</h3>
              <p className="text-ink-600 text-sm">Flowing & Dynamic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;