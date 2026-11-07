// src/components/GameBoard.jsx
import React from 'react'
import SearchPlayer from './SearchPlayer'
import GuessHistory from './GuessHistory'
import HintSystem from './HintSystem'
import ScoreCard from './ScoreCard'
import { getPlayerRuns, getPlayerWickets } from '../utils/gameLogic'

function GameBoard({
  gameStarted,
  gameOver,
  won,
  targetPlayer,
  guesses,
  attempts,
  maxAttempts,
  hintsRemaining,
  hintMessage,
  score,
  onGuess,
  onGetHint,
  onNewGame,
  onQuit,
  isQuit,
}) {
  const isUnlimited = maxAttempts === 9999
  const remainingAttempts = isUnlimited ? "∞" : maxAttempts - attempts

  const targetRuns = getPlayerRuns(targetPlayer)
  const targetWickets = getPlayerWickets(targetPlayer)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with attempts and score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-2xl">
            🏏
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Guess the Cricketer</h2>
            <p className="text-sm text-gray-400">Can you identify today's cricketer?</p>
          </div>
        </div>
        <ScoreCard
          score={score}
          attempts={attempts}
          hintsUsed={3 - hintsRemaining}
          maxAttempts={maxAttempts}
        />
      </div>

      {/* Attempts indicator and I Quit button */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {isUnlimited ? (
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-400">∞</div>
            <span className="text-gray-400 text-sm">Unlimited guesses available</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {Array.from({ length: maxAttempts }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                  i < attempts
                    ? 'bg-green-600 text-white'
                    : i === attempts && !gameOver
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* I Quit Button */}
        {!gameOver && gameStarted && onQuit && (
          <button
            onClick={onQuit}
            type="button"
            className="px-4 py-2 bg-red-950/50 hover:bg-red-600 text-red-300 hover:text-white border border-red-700/60 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Give up and reveal the correct cricketer"
          >
            <span>🏳️</span>
            <span>I Quit</span>
          </button>
        )}
      </div>

      {/* Search input */}
      <SearchPlayer
        onPlayerSelect={onGuess}
        gameStarted={gameStarted}
        disabled={gameOver}
      />

      {/* Guess history */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3">Guess History</h3>
        <GuessHistory guesses={guesses} />
      </div>

      {/* Hint system */}
      {!gameOver && (
        <HintSystem
          hintsRemaining={hintsRemaining}
          onGetHint={onGetHint}
          hintMessage={hintMessage}
        />
      )}

      {/* Game over / Revealed Answer card */}
      {gameOver && !won && (
        <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-gray-700 text-center shadow-xl">
          <div className="text-4xl mb-3">🏳️</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isQuit ? 'You Quit! Answer Revealed' : 'Game Over!'}
          </h3>
          <p className="text-gray-300 mb-4 text-base">
            The cricketer was <strong className="text-green-400 text-xl font-bold">{targetPlayer?.name}</strong> from <strong className="text-green-400 font-semibold">{targetPlayer?.country}</strong>.
          </p>

          {/* Revealed Player Details Card */}
          <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs text-left bg-gray-900/90 p-3.5 rounded-lg border border-gray-700">
            <div>
              <span className="text-gray-400 block font-medium">Role</span>
              <span className="text-white font-semibold text-sm">{targetPlayer?.role}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Batting</span>
              <span className="text-white font-semibold text-sm">{targetPlayer?.battingStyle}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Score (Runs)</span>
              <span className="text-green-400 font-bold text-sm">{targetRuns.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Wickets</span>
              <span className="text-green-400 font-bold text-sm">{targetWickets}</span>
            </div>
          </div>

          <button
            onClick={onNewGame}
            type="button"
            className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold shadow-md active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard
