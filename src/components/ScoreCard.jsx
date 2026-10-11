// src/components/ScoreCard.jsx
import React from 'react'

function ScoreCard({ score, attempts, hintsUsed, maxAttempts }) {
  const isUnlimited = maxAttempts === 9999
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-3">Game Stats</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">{attempts}</div>
          <div className="text-xs text-gray-400">{isUnlimited ? 'Total Guesses' : 'Attempts'}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{hintsUsed}</div>
          <div className="text-xs text-gray-400">Hints Used</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{score}</div>
          <div className="text-xs text-gray-400">Score</div>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard