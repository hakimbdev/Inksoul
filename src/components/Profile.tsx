import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  // In a real app, you would fetch user data from an API
  const user = {
    name: 'Test Calligrapher',
    email: 'test@example.com',
    bio: 'Specializing in modern and traditional calligraphy.',
    avatar: `https://avatar.vercel.sh/test.png`,
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-br from-primary-50 to-gold-50 p-8">
            <div className="flex items-center">
                <img className="h-24 w-24 rounded-full object-cover" src={user.avatar} alt="User avatar" />
                <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            </div>
        </div>
        <div className="border-t border-gray-200 px-8 py-6">
          <h3 className="text-lg font-medium text-gray-900">About Me</h3>
          <p className="mt-2 text-gray-600">
            {user.bio}
          </p>
        </div>
        <div className="border-t border-gray-200 px-8 py-6">
           <h3 className="text-lg font-medium text-gray-900">Actions</h3>
           <div className="mt-4 flex space-x-4">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Settings className="w-5 h-5 mr-2 text-gray-500" />
                    Edit Profile
                </button>
                <button 
                    onClick={onLogout}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 