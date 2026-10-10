import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import GameOverModal from './components/GameOverModal'
import HowToPlay from './components/HowToPlay'
import Leaderboard from './components/Leaderboard'
import Stats from './components/Stats'
import { getRandomPlayer, getDailyPlayer, comparePlayers } from './utils/gameLogic'

function App() {
  const [activeTab, setActiveTab] = useState('play')
  const [targetPlayer, setTargetPlayer] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [guesses, setGuesses] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts] = useState(5)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [hintMessage, setHintMessage] = useState('')
  const [score, setScore] = useState(0)
  const [highScores, setHighScores] = useState([])
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    averageScore: 0,
    streak: 0
  })

  // Load high scores and stats from localStorage on mount
  useEffect(() => {
    const savedHighScores = localStorage.getItem('cricket-high-scores')
    const savedStats = localStorage.getItem('cricket-stats')

    if (savedHighScores) {
      setHighScores(JSON.parse(savedHighScores))
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save high scores and stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cricket-high-scores', JSON.stringify(highScores))
  }, [highScores])

  useEffect(() => {
    localStorage.setItem('cricket-stats', JSON.stringify(stats))
  }, [stats])

  // Get a new daily target player
  const getNewTargetPlayer = () => {
    const newTarget = getDailyPlayer()
    setTargetPlayer(newTarget)
    setScore(0)
  }

  // Start a new game
  const startNewGame = () => {
    getNewTargetPlayer()
    setGameStarted(true)
    setGameOver(false)
    setWon(false)
    setGuesses([])
    setAttempts(0)
    setHintsRemaining(3)
    setHintMessage('')
    setScore(0)
  }

  // Handle player guess
  const handleGuess = (guessedPlayer) => {
    if (!gameStarted || gameOver) return

    const newGuess = {
      id: guessedPlayer.id,
      name: guessedPlayer.name,
      country: guessedPlayer.country,
      role: guessedPlayer.role,
      battingStyle: guessedPlayer.battingStyle,
      bowlingStyle: guessedPlayer.bowlingStyle,
      dateOfBirth: guessedPlayer.dateOfBirth,
      debutYear: guessedPlayer.debutYear,
      matches: guessedPlayer.matches,
      runs: guessedPlayer.runs,
      wickets: guessedPlayer.wickets,
      image: guessedPlayer.image
    }

    // Compare with target player
    const comparison = comparePlayers(guessedPlayer.id, targetPlayer.id)

    // Calculate new score based on comparison
    let guessScore = 0
    let hintsUsed = 0

    // Check if guess is correct
    const allCorrect = Object.values(comparison).every(
      attribute => attribute.status === 'correct'
    )
    const allIncorrect = Object.values(comparison).every(
      attribute => attribute.status === 'incorrect' || attribute.status === 'different'
    )

    if (allCorrect) {
      // Perfect guess
      guessScore = 250
      setWon(true)
      setGameOver(true)

      // Update stats
      setStats(prev => {
        const newStats = {
          ...prev,
          totalGames: prev.totalGames + 1,
          gamesWon: prev.gamesWon + 1,
          averageScore: ((prev.averageScore * prev.totalGames) + 250) / (prev.totalGames + 1),
          streak: prev.streak + 1
        }
        return newStats
      })

      // Add to high scores
      const newScoreEntry = {
        date: new Date().toLocaleDateString(),
        score: 250,
        attempts: 1,
        target: targetPlayer.name,
        hintsUsed: 0
      }
      setHighScores(prev => [newScoreEntry, ...prev].sort((a, b) => b.score - a.score).slice(0, 10))

    } else {
      // Regular guess
      guessScore = comparison.similarityScore
      setScore(prev => prev + guessScore)
      setAttempts(prev => prev + 1)

      // Update stats
      setStats(prev => {
        const newStats = {
          ...prev,
          totalGames: prev.totalGames + 1,
          gamesWon: prev.gamesWon + (allCorrect ? 1 : 0),
          averageScore: ((prev.averageScore * prev.totalGames) + guessScore) / (prev.totalGames + 1),
          streak: allCorrect ? prev.streak + 1 : 0
        }
        return newStats
      })

      // Add to guesses
      setGuesses(prev => [...prev, { ...newGuess, comparison, score: guessScore }])

      // Check if game over (attempts used up)
      if (attempts + 1 >= maxAttempts) {
        setGameOver(true)
        setWon(false)

        // Add to high scores
        const newScoreEntry = {
          date: new Date().toLocaleDateString(),
          score: guessScore,
          attempts: attempts + 1,
          target: targetPlayer.name,
          hintsUsed: 3 - hintsRemaining
        }
        setHighScores(prev => [newScoreEntry, ...prev].sort((a, b) => b.score - a.score).slice(0, 10))
      }
    }
  }

  // Get hint
  const getHint = () => {
    if (hintsRemaining <= 0 || !targetPlayer || !gameStarted || gameOver) return

    setHintsRemaining(prev => prev - 1)

    // Generate hint based on target player
    const hintTypes = [
      `The cricketer is from ${targetPlayer.country}`,
      `He plays as a ${targetPlayer.role}`,
      `He bats ${targetPlayer.battingStyle}`,
      `He bowls ${targetPlayer.bowlingStyle || 'not at all'}`
    ]

    // Get unused hint
    const usedHints = 3 - hintsRemaining
    const hint = hintTypes[usedHints % hintTypes.length]
    setHintMessage(hint)

    // Auto-hide hint after 5 seconds
    setTimeout(() => {
      setHintMessage('')
    }, 5000)
  }

  // Share game results
  const shareGame = () => {
    const text = `I scored ${score} points guessing ${targetPlayer.name} in ${attempts} ${attempts === 1 ? 'guess' : 'guesses'} on Guess the Cricketer! #CricketGame`

    if (navigator.share) {
      navigator.share({
        title: 'Guess the Cricketer - Game Results',
        text: text
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!')
      })
    }
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'how-to-play':
        return <HowToPlay />
      case 'leaderboard':
        return <Leaderboard scores={highScores} />
      case 'stats':
        return <Stats stats={stats} />
      default:
        return (
          <GameBoard
            gameStarted={gameStarted}
            gameOver={gameOver}
            won={won}
            targetPlayer={targetPlayer}
            guesses={guesses}
            attempts={attempts}
            maxAttempts={maxAttempts}
            hintsRemaining={hintsRemaining}
            hintMessage={hintMessage}
            score={score}
            onGuess={handleGuess}
            onGetHint={getHint}
            onNewGame={startNewGame}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={setActiveTab} activeTab={activeTab} />

      <main className="container mx-auto px-4 py-6">
        {!gameStarted && activeTab === 'play' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Guess the Cricketer!</h2>
            <p className="text-gray-400 mb-6">
              Guess today's cricketer based on various statistics and hints.
              You have {maxAttempts} attempts to identify the player!
            </p>
            <button
              onClick={startNewGame}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      {gameOver && targetPlayer && (
        <GameOverModal
          won={won}
          targetPlayer={targetPlayer}
          score={score}
          attempts={attempts}
          hintsUsed={3 - hintsRemaining}
          onPlayAgain={startNewGame}
          onShare={shareGame}
        />
      )}
    </div>
  )
}

export default App