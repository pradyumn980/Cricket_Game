// src/components/GameOverModal.jsx
import React, { useEffect, useRef } from 'react'

function GameOverModal({ won, targetPlayer, score, attempts, hintsUsed, onPlayAgain, onShare }) {
  const modalRef = useRef(null)

  useEffect(() => {
    // Focus trap for accessibility
    const firstFocusable = modalRef.current?.querySelector('.close-btn, .play-again-btn, .share-btn')
    firstFocusable?.focus()
  }, [])

  if (!targetPlayer) return null

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-2 relative shadow-2xl border border-gray-800">
        {/* Close button */}
        <button
          onClick={onPlayAgain}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center">
          {won ? (
            <>
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Correct!</h2>
              <p className="text-green-400 text-lg font-medium mb-4">
                You found {targetPlayer.name} in {attempts} {attempts === 1 ? 'guess' : 'guesses'}!
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">😞</div>
              <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
              <p className="text-gray-300 mb-4">
                The cricketer was <span className="text-green-400 font-bold">{targetPlayer.name}</span>
              </p>
            </>
          )}

          {/* Player image */}
          <div className="mb-4">
            <div className="w-24 h-32 mx-auto bg-green-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {targetPlayer.name.charAt(0)}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{attempts}</div>
              <div className="text-xs text-gray-400">Attempts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{hintsUsed}</div>
              <div className="text-xs text-gray-400">Hints</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 share-btn"
            >
              📤 Share
            </button>
            <button
              onClick={onPlayAgain}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium play-again-btn"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal