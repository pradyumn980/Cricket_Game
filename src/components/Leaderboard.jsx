// src/components/Leaderboard.jsx
import React from 'react'

function Leaderboard({ leaderboard, onReset }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No scores yet. Be the first to set a record!
          </p>
        ) : (
          <ol className="space-y-2 text-sm">
            {leaderboard.map((entry, idx) => (
              <li key={entry.id} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </span>
                <span className="text-white flex-1">{entry.name}</span>
                <span className="text-green-400 font-medium">{entry.score} pts</span>
                <span className="text-gray-400 text-xs">in {entry.attempts} attempts</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Clear Leaderboard
        </button>
      </div>
    </div>
  )
}

export default Leaderboard