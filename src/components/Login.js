import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const { login, isLoading, error } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    await login(nickname.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4">
                <img 
                  src={`${process.env.PUBLIC_URL}/Logo.png`}
                  alt="NorLearn Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                NorLearn
              </h1>
            </div>
          </div>
          <p className="text-gray-600 mb-8 text-lg">
            Learn Norwegian with flashcards and pronunciation
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? 'Starting...' : 'Start Learning'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
