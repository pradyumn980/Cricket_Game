// src/components/GameOverModal.jsx
import React, { useEffect, useRef } from 'react'
import { getPlayerRuns, getPlayerWickets } from '../utils/gameLogic'

function GameOverModal({ won, isQuit, targetPlayer, score, attempts, hintsUsed, onPlayAgain, onShare }) {
  const modalRef = useRef(null)

  useEffect(() => {
    // Focus trap for accessibility
    const firstFocusable = modalRef.current?.querySelector('.close-btn, .play-again-btn, .share-btn')
    firstFocusable?.focus()
  }, [])

  if (!targetPlayer) return null

  const targetRuns = getPlayerRuns(targetPlayer)
  const targetWickets = getPlayerWickets(targetPlayer)

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-2 relative shadow-2xl border border-gray-800">
        {/* Close button */}
        <button
          onClick={onPlayAgain}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl font-bold p-1 close-btn"
        >
          ✕
        </button>

        <div className="text-center">
          {won ? (
            <>
              <div className="text-6xl mb-3 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-1">Correct!</h2>
              <p className="text-green-400 text-lg font-medium mb-3">
                You found {targetPlayer.name} in {attempts} {attempts === 1 ? 'guess' : 'guesses'}!
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">🏳️</div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isQuit ? 'You Quit! Answer Revealed' : 'Game Over!'}
              </h2>
              <p className="text-gray-400 text-sm mb-1">
                The correct cricketer was:
              </p>
              <h3 className="text-2xl font-extrabold text-green-400 mb-3">
                {targetPlayer.name}
              </h3>
            </>
          )}

          {/* Player initial avatar */}
          <div className="mb-3">
            <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {targetPlayer.name ? targetPlayer.name.charAt(0) : '?'}
            </div>
            <p className="text-gray-300 text-sm mt-1.5 font-medium">
              {targetPlayer.country} • {targetPlayer.role}
            </p>
          </div>

          {/* Detailed revealed cricketer stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-left bg-gray-800/90 p-3 rounded-lg border border-gray-750 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Batting Style</span>
              <span className="text-white font-semibold">{targetPlayer.battingStyle || '—'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">ODI Score (Runs)</span>
              <span className="text-green-400 font-bold">{targetRuns.toLocaleString()} runs</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Bowling Style</span>
              <span className="text-white font-semibold truncate block">{targetPlayer.bowlingStyle || 'None'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">ODI Wickets</span>
              <span className="text-green-400 font-bold">{targetWickets} wkts</span>
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5 text-center bg-gray-950/60 p-2.5 rounded-lg border border-gray-800">
            <div>
              <div className="text-xl font-bold text-white">{score}</div>
              <div className="text-[11px] text-gray-400">Score</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{attempts}</div>
              <div className="text-[11px] text-gray-400">Attempts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{hintsUsed}</div>
              <div className="text-[11px] text-gray-400">Hints</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {won && (
              <button
                onClick={onShare}
                type="button"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 share-btn text-sm"
              >
                📤 Share
              </button>
            )}
            <button
              onClick={onPlayAgain}
              type="button"
              className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold play-again-btn text-sm shadow-md active:scale-95"
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
