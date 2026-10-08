// src/components/SearchPlayer.jsx
import React, { useState, useEffect, useRef } from 'react'
import { players } from '../data/players'

const MAX_SUGGESTIONS = 5

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
      player.name.toLowerCase().includes(lowerTerm)
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
    setSearchTerm(player.name)
    onPlayerSelect(player)
    setShowSuggestions(false)
  }

  const handleSubmit = () => {
    if (searchTerm.trim() && filteredPlayers.some((p) => p.name === searchTerm)) {
      const selected = filteredPlayers.find((p) => p.name === searchTerm)
      if (selected) {
        onPlayerSelect(selected)
        setShowSuggestions(false)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-400 text-xl">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter cricketer name..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          disabled={!gameStarted || disabled}
        />
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto no-scrollbar"
        >
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => handleSelect(player)}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
                {player.name.charAt(0)}
              </div>
              <span className="text-white">{player.name}</span>
              <span className="ml-auto text-gray-400 text-sm">{player.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPlayer