// src/components/Stats.jsx
import React from 'react'

function Stats({ stats, onReset }) {
  const formatPercentage = (value) => {
    return Math.round(value * 100).toString() + '%'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Game Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.gamesPlayed}</div>
            <div className="text-sm text-gray-400 mt-1">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.gamesWon}</div>
            <div className="text-sm text-gray-400 mt-1">Games Won</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.winPercentage}%</div>
            <div className="text-sm text-gray-400 mt-1">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.averageAttempts}</div>
            <div className="text-sm text-gray-400 mt-1">Avg Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.bestScore}</div>
            <div className="text-sm text-gray-400 mt-1">Best Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
            <div className="text-sm text-gray-400 mt-1">Current Streak</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Reset Statistics
        </button>
      </div>
    </div>
  )
}

export default Stats