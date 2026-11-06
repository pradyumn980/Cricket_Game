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

  const getDirectionBadge = (direction) => {
    if (!direction) return null
    return direction === 'higher' ? (
      <span
        className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-600/40 px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0"
        title="Target score is MORE"
      >
        ⬆️ More
      </span>
    ) : (
      <span
        className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-600/40 px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0"
        title="Target score is LESS"
      >
        ⬇️ Less
      </span>
    )
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <div className="grid grid-cols-12 gap-2 bg-gray-900 p-2.5 font-medium text-gray-300 text-xs uppercase tracking-wider">
            <div className="col-span-2 px-1">PLAYER</div>
            <div className="col-span-1 px-1">COUNTRY</div>
            <div className="col-span-1 px-1">ROLE</div>
            <div className="col-span-1 px-1">BATTING</div>
            <div className="col-span-1 px-1">BOWLING</div>
            <div className="col-span-1 px-1">AGE</div>
            <div className="col-span-1 px-1">DEBUT</div>
            <div className="col-span-2 px-1">SCORE (RUNS)</div>
            <div className="col-span-2 px-1 text-right">MATCH %</div>
          </div>
          <div className="divide-y divide-gray-700">
            {guesses.map((guess, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center p-2.5 text-sm">
                <div className="col-span-2 font-medium text-white truncate px-1">{guess.name}</div>
                <div className="col-span-1 px-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.country?.status)}`}>
                    {getStatusLabel(guess.comparison.country?.status)}
                  </span>
                </div>
                <div className="col-span-1 px-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.role?.status)}`}>
                    {getStatusLabel(guess.comparison.role?.status)}
                  </span>
                  <span className="text-gray-400 text-xs block truncate">{guess.comparison.role?.value}</span>
                </div>
                <div className="col-span-1 px-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.battingStyle?.status)}`}>
                    {getStatusLabel(guess.comparison.battingStyle?.status)}
                  </span>
                </div>
                <div className="col-span-1 px-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.bowlingStyle?.status)}`}>
                    {guess.comparison.bowlingStyle?.value ? getStatusLabel(guess.comparison.bowlingStyle?.status) : '—'}
                  </span>
                </div>
                <div className="col-span-1 px-1 flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.age?.status)}`}>
                    {getStatusLabel(guess.comparison.age?.status)}
                  </span>
                  {guess.comparison.age?.direction && getDirectionIcon(guess.comparison.age?.direction)}
                  <span className="text-gray-400 text-xs">{guess.comparison.age?.value}</span>
                </div>
                <div className="col-span-1 px-1 flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.debutYear?.status)}`}>
                    {getStatusLabel(guess.comparison.debutYear?.status)}
                  </span>
                  {guess.comparison.debutYear?.direction && getDirectionIcon(guess.comparison.debutYear?.direction)}
                  <span className="text-gray-400 text-xs">{guess.comparison.debutYear?.value}</span>
                </div>
                {/* Score (Runs) Column with Less/More indicator */}
                <div className="col-span-2 px-1 flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getStatusColor(guess.comparison.runs?.status)}`}>
                    {getStatusLabel(guess.comparison.runs?.status)}
                  </span>
                  <span className="text-white text-xs font-semibold">
                    {(guess.comparison.runs?.value ?? guess.runs?.odi ?? 0).toLocaleString()}
                  </span>
                  {getDirectionBadge(guess.comparison.runs?.direction)}
                </div>
                {/* Overall similarity match percentage */}
                <div className="col-span-2 px-1 text-right font-bold text-green-400 text-base">
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
