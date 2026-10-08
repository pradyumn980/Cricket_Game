// src/components/GuessRow.jsx
import React from 'react'

function GuessRow({ guessResult, index }) {
  const { player, comparison } = guessResult

  // Helper to get status color class
  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-600 text-white'
      case 'close':
        return 'bg-yellow-500 text-black'
      case 'moderate':
        return 'bg-orange-500 text-white'
      case 'different':
      case 'incorrect':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getDirectionIcon = (direction) => {
    if (!direction) return null
    return direction === 'higher' ? '⬆️' : '⬇️'
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'correct':
        return '🟢'
      case 'close':
        return '🟡'
      case 'moderate':
        return '🟠'
      case 'different':
      case 'incorrect':
        return '🔴'
      default:
        return '⚪'
    }
  }

  return (
    <div className="slide-in bg-gray-800 rounded-lg p-4 mb-3 shadow-lg border border-gray-700">
      {/* Player info header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 rounded bg-green-600 flex items-center justify-center text-lg font-bold text-white">
            {player.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold">{player.name}</h4>
            <p className="text-gray-400 text-sm">{player.country}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {comparison.similarityScore}%
          </div>
          <div className="text-xs text-gray-400">Similarity</div>
        </div>
      </div>

      {/* Attributes comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Country */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Country</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.country.status)}`}>
              {getStatusLabel(comparison.country.status)}
            </span>
            <span className="text-white text-sm">{comparison.country.value}</span>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Role</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.role.status)}`}>
              {getStatusLabel(comparison.role.status)}
            </span>
            <span className="text-white text-sm">{comparison.role.value}</span>
          </div>
        </div>

        {/* Batting */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Batting</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.battingStyle.status)}`}>
              {getStatusLabel(comparison.battingStyle.status)}
            </span>
            <span className="text-white text-sm">{comparison.battingStyle.value}</span>
          </div>
        </div>

        {/* Bowling */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Bowling</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.bowlingStyle.status)}`}>
              {getStatusLabel(comparison.bowlingStyle.status)}
            </span>
            <span className="text-white text-sm">{comparison.bowlingStyle.value || 'N/A'}</span>
          </div>
        </div>

        {/* Age */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Age</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.age.status)}`}>
              {getStatusLabel(comparison.age.status)}
            </span>
            <span className="text-white text-sm">{comparison.age.value}</span>
            {getDirectionIcon(comparison.age.direction)}
          </div>
        </div>

        {/* Debut */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Debut</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.debutYear.status)}`}>
              {getStatusLabel(comparison.debutYear.status)}
            </span>
            <span className="text-white text-sm">{comparison.debutYear.value}</span>
            {getDirectionIcon(comparison.debutYear.direction)}
          </div>
        </div>

        {/* Runs */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Runs</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.runs.status)}`}>
              {getStatusLabel(comparison.runs.status)}
            </span>
            <span className="text-white text-sm">{comparison.runs.value.toLocaleString()}</span>
            {getDirectionIcon(comparison.runs.direction)}
          </div>
        </div>

        {/* Wickets */}
        <div className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
          <span className="text-gray-400 text-sm">Wickets</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(comparison.wickets.status)}`}>
              {getStatusLabel(comparison.wickets.status)}
            </span>
            <span className="text-white text-sm">{comparison.wickets.value}</span>
            {getDirectionIcon(comparison.wickets.direction)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuessRow