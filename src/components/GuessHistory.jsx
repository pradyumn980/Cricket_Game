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

  const getDirectionBadge = (direction, type = 'runs') => {
    if (!direction) return null
    return direction === 'higher' ? (
      <span
        className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 whitespace-nowrap shadow-sm"
        title="Target cricketer is higher"
      >
        ⬆️ More
      </span>
    ) : (
      <span
        className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600/50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 whitespace-nowrap shadow-sm"
        title="Target cricketer is lower"
      >
        ⬇️ Less
      </span>
    )
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-gray-300 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">PLAYER</th>
                <th className="py-3 px-2 text-center">COUNTRY</th>
                <th className="py-3 px-3">ROLE</th>
                <th className="py-3 px-3">BATTING & SCORE</th>
                <th className="py-3 px-3">BOWLING & WKTS</th>
                <th className="py-3 px-2 text-center">AGE</th>
                <th className="py-3 px-2 text-center">DEBUT</th>
                <th className="py-3 px-3 text-right">MATCH %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {guesses.map((guess, idx) => (
                <tr key={idx} className="hover:bg-gray-750/40 transition-colors">
                  {/* Player Name */}
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap text-sm">
                    {guess.name}
                  </td>

                  {/* Country */}
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.country?.status)}`}>
                        {getStatusLabel(guess.comparison.country?.status)}
                      </span>
                      <span className="text-gray-400 text-xs">{guess.country}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.role?.status)}`}>
                        {getStatusLabel(guess.comparison.role?.status)}
                      </span>
                      <span className="text-gray-200 text-xs font-medium">{guess.role}</span>
                    </div>
                  </td>

                  {/* Batting (Style + Runs / Score) */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      {/* Batting Style */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${getStatusColor(guess.comparison.battingStyle?.status)}`}>
                          {getStatusLabel(guess.comparison.battingStyle?.status)}
                        </span>
                        <span className="text-gray-300 text-xs font-medium">
                          {guess.comparison.battingStyle?.value || guess.battingStyle || '—'}
                        </span>
                      </div>
                      {/* Score / Runs with Less/More indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${getStatusColor(guess.comparison.runs?.status)}`}>
                          {getStatusLabel(guess.comparison.runs?.status)}
                        </span>
                        <span className="text-white text-xs font-bold">
                          {(guess.comparison.runs?.value ?? guess.runs?.odi ?? 0).toLocaleString()} runs
                        </span>
                        {getDirectionBadge(guess.comparison.runs?.direction, 'runs')}
                      </div>
                    </div>
                  </td>

                  {/* Bowling (Style + Wickets) */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      {/* Bowling Style */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${getStatusColor(guess.comparison.bowlingStyle?.status)}`}>
                          {guess.comparison.bowlingStyle?.value ? getStatusLabel(guess.comparison.bowlingStyle?.status) : '—'}
                        </span>
                        <span className="text-gray-300 text-xs font-medium">
                          {guess.comparison.bowlingStyle?.value || guess.bowlingStyle || 'None'}
                        </span>
                      </div>
                      {/* Wickets with Less/More indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${getStatusColor(guess.comparison.wickets?.status)}`}>
                          {getStatusLabel(guess.comparison.wickets?.status)}
                        </span>
                        <span className="text-white text-xs font-bold">
                          {(guess.comparison.wickets?.value ?? guess.wickets?.odi ?? 0)} wkts
                        </span>
                        {getDirectionBadge(guess.comparison.wickets?.direction, 'wickets')}
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.age?.status)}`}>
                        {getStatusLabel(guess.comparison.age?.status)}
                      </span>
                      <span className="text-gray-200 text-xs font-semibold">{guess.comparison.age?.value}</span>
                      {guess.comparison.age?.direction && (
                        <span className="text-xs">{getDirectionIcon(guess.comparison.age?.direction)}</span>
                      )}
                    </div>
                  </td>

                  {/* Debut */}
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(guess.comparison.debutYear?.status)}`}>
                        {getStatusLabel(guess.comparison.debutYear?.status)}
                      </span>
                      <span className="text-gray-200 text-xs font-semibold">{guess.comparison.debutYear?.value}</span>
                      {guess.comparison.debutYear?.direction && (
                        <span className="text-xs">{getDirectionIcon(guess.comparison.debutYear?.direction)}</span>
                      )}
                    </div>
                  </td>

                  {/* Match % */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="text-green-400 font-bold text-base">
                      {guess.comparison.similarityScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
