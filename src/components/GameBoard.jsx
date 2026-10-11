// src/components/GameBoard.jsx
import React from 'react'
import SearchPlayer from './SearchPlayer'
import GuessHistory from './GuessHistory'
import HintSystem from './HintSystem'
import ScoreCard from './ScoreCard'

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
}) {
  const isUnlimited = maxAttempts === 9999
  const remainingAttempts = isUnlimited ? "∞" : maxAttempts - attempts

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
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

      {/* Attempts indicator - unlimited mode */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Game over state */}
      {gameOver && !won && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <div className="text-4xl mb-3">😔</div>
          <h3 className="text-xl font-bold text-white mb-2">Game Over!</h3>
          <p className="text-gray-400 mb-4">
            The cricketer was <strong className="text-green-400">{targetPlayer?.name}</strong>
            from <strong className="text-green-400">{targetPlayer?.country}</strong>.
          </p>
          <button
            onClick={onNewGame}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard