// src/components/GuessHistory.jsx
import React from 'react'
import GuessRow from './GuessRow'

function GuessHistory({ guesses }) {
  if (guesses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No guesses yet. Start by entering a cricketer name!
      </div>
    )
  }

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

  const getDirectionIcon = (direction) => {
    if (!direction) return null
    return direction === 'higher' ? '⬆️' : '⬇️'
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 gap-2 bg-gray-900 p-2 font-medium text-gray-300 text-sm">
            <div className="px-2">PLAYER</div>
            <div className="px-1">COUNTRY</div>
            <div className="px-1">ROLE</div>
            <div className="px-1">BATTING</div>
            <div className="px-1">BOWLING</div>
            <div className="px-1">AGE</div>
            <div className="px-1">DEBUT</div>
            <div className="px-1 text-right">SCORE</div>
          </div>
          <div className="divide-y divide-gray-700">
            {guesses.map((guess, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-2 items-center p-2 text-sm">
                <div className="font-medium text-white truncate">{guess.name}</div>
                <div>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.country.status)}`}>
                    {getStatusLabel(guess.comparison.country.status)}
                  </span>
                </div>
                <div>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.role.status)}`}>
                    {getStatusLabel(guess.comparison.role.status)}
                  </span>
                  <span className="text-gray-400 text-xs">{guess.comparison.role.value}</span>
                </div>
                <div>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.battingStyle.status)}`}>
                    {getStatusLabel(guess.comparison.battingStyle.status)}
                  </span>
                </div>
                <div>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.bowlingStyle.status)}`}>
                    {guess.comparison.bowlingStyle.value ? getStatusLabel(guess.comparison.bowlingStyle.status) : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.age.status)}`}>
                    {getStatusLabel(guess.comparison.age.status)}
                  </span>
                  {guess.comparison.age.direction && getDirectionIcon(guess.comparison.age.direction)}
                  <span className="text-gray-400">{guess.comparison.age.value}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.debutYear.status)}`}>
                    {getStatusLabel(guess.comparison.debutYear.status)}
                  </span>
                  {guess.comparison.debutYear.direction && getDirectionIcon(guess.comparison.debutYear.direction)}
                  <span className="text-gray-400">{guess.comparison.debutYear.value}</span>
                </div>
                <div className="text-right font-bold text-green-400">
                  {guess.comparison.similarityScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {guesses.map((guess, idx) => (
          <GuessRow key={idx} guessResult={guess} index={idx} />
        ))}
      </div>
    </div>
  )
}

export default GuessHistory