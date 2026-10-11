// src/components/HowToPlay.jsx
import React from 'react'

function HowToPlay({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-2 relative shadow-2xl border border-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 pr-8">How to Play</h2>

        <div className="space-y-4 text-gray-300">
          <p>
            1. Guess a cricketer by typing their name in the search box above.
          </p>
          <p>
            2. Click on the player from the autocomplete suggestions, or press Enter.
          </p>
          <p>
            3. Check how close your guess is compared to the target cricketer.
          </p>

          <div className="my-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <span><strong className="text-green-400">Correct</strong> — Exact match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟡</span>
              <span><strong className="text-yellow-400">Close</strong> — You're getting close</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟠</span>
              <span><strong className="text-orange-400">Moderate</strong> — Different but not too far</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <span><strong className="text-red-400">Different</strong> — Not matching</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⬆️</span>
              <span>Target value is higher</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⬇️</span>
              <span>Target value is lower</span>
            </div>
          </div>

          <p>
            <strong className="text-green-400">Goal</strong>: Guess the correct cricketer! You have unlimited guesses — keep going until you find the right player.
          </p>

          <p>
            <strong className="text-green-400">Score System</strong>:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Base score: 1000 points</li>
            <li>Each guess: -100 points</li>
            <li>Each hint: -100 points</li>
            <li>Score cannot go negative</li>
          </ul>

          <p>
            <strong className="text-green-400">Game Modes</strong>: Random Mode, IPL Mode, India Mode, International Mode.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}

export default HowToPlay