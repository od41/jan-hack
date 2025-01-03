"use client";
import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

const App = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [nearbyPlayers, setNearbyPlayers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const emojis = ['😊', '😎', '🤖', '👻', '🦁', '🐱'];

  useEffect(() => {
    if (isLoggedIn) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {!isLoggedIn ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Welcome to Location Game</h1>
          <button 
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Select Your Avatar</h2>
            <div className="flex gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`text-2xl p-2 rounded ${
                    selectedEmoji === emoji ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Nearby Players</h2>
            <div className="relative h-64 bg-slate-50 rounded border-2 border-dashed border-slate-200">
              {/* Center player */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-3xl">{selectedEmoji}</div>
              </div>
              
              {/* Sample nearby players */}
              {nearbyPlayers.map((player, index) => (
                <div
                  key={index}
                  className="absolute text-2xl"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`
                  }}
                >
                  {player.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;