// src/components/Header.jsx
import React from 'react'

function Header({ onNavigate, activeTab }) {
  const navItems = [
    { id: 'play', label: 'Play' },
    { id: 'how-to-play', label: 'How to Play' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'stats', label: 'Stats' },
  ]

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏏</span>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Guess the Cricketer
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header