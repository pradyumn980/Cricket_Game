// src/components/HintSystem.jsx
import React from 'react'

function HintSystem({ hintsRemaining, onGetHint, hintMessage }) {
  const getHintIcon = () => {
    if (hintsRemaining >= 3) return '💡'
    if (hintsRemaining === 2) return '💡'
    if (hintsRemaining === 1) return '💡'
    return '❌'
  }

  const getHintColor = () => {
    if (hintsRemaining >= 2) return 'text-yellow-400'
    if (hintsRemaining === 1) return 'text-orange-400'
    return 'text-gray-500'
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-sm">
          {getHintIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-300">Hints</p>
          <p className="text-base font-bold text-white">{3 - (3 - hintsRemaining)} / 3 used</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={onGetHint}
            disabled={hintsRemaining === 0}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              hintsRemaining === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Get Hint
          </button>
        </div>
      </div>

      {hintMessage && (
        <div className="mt-2 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-green-300">{hintMessage}</p>
        </div>
      )}
    </div>
  )
}

export default HintSystem