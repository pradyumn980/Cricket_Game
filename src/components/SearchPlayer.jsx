// src/components/SearchPlayer.jsx
import React, { useState, useEffect, useRef } from 'react'
import { players } from '../data/players'

const MAX_SUGGESTIONS = 6

function SearchPlayer({ onPlayerSelect, gameStarted, disabled }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Filter players as user types
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers([])
      setShowSuggestions(false)
      return
    }

    const lowerTerm = searchTerm.toLowerCase()
    const matches = players.filter((player) =>
      player.name && player.name.toLowerCase().includes(lowerTerm)
    )

    setFilteredPlayers(matches.slice(0, MAX_SUGGESTIONS))
    setShowSuggestions(matches.length > 0)
  }, [searchTerm])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (player) => {
    if (!player) return
    setSearchTerm('')
    setShowSuggestions(false)
    onPlayerSelect(player)
  }

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    const trimmed = searchTerm.trim()
    if (!trimmed) return

    const lower = trimmed.toLowerCase()
    const selected =
      filteredPlayers.find((p) => p.name && p.name.toLowerCase() === lower) ||
      (filteredPlayers.length > 0 ? filteredPlayers[0] : null) ||
      players.find((p) => p.name && p.name.toLowerCase() === lower)

    if (selected) {
      handleSelect(selected)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <span className="absolute left-4 text-gray-400 text-xl pointer-events-none">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter cricketer name..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          disabled={!gameStarted || disabled}
          autoComplete="off"
        />
      </form>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto no-scrollbar"
        >
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => handleSelect(player)}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-700 transition-colors flex items-center justify-between gap-3 border-b border-gray-700/40 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {player.name ? player.name.charAt(0) : '?'}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-medium text-sm truncate">{player.name}</div>
                  <div className="text-gray-400 text-xs truncate">
                    {player.country} • {player.role}
                  </div>
                </div>
              </div>
              <span className="text-gray-400 text-xs shrink-0">{player.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPlayer
