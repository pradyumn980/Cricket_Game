// src/utils/gameLogic.js

import { players } from '../data/players.js'

/**
 * Find a player by ID in the dataset.
 * Returns undefined if not found.
 */
export function findPlayerById(id) {
  return players.find((p) => p.id === id)
}

/**
 * Get a random player from the dataset.
 */
export function getRandomPlayer() {
  const randomIndex = Math.floor(Math.random() * players.length)
  return players[randomIndex]
}

/**
 * Get a daily fixed player (same for all users per day).
 * Uses date-based seed so the same player is selected each day.
 */
export function getDailyPlayer() {
  // Use the day of year as seed to pick a player
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor(
    (now - startOfYear) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % players.length
  return players[index]
}

/**
 * Determine if a guess player matches the target in a categorical attribute.
 * Returns { status: 'correct' | 'close' | 'incorrect', value: string }
 */
function compareCategorical(guessValue, targetValue) {
  if (guessValue === targetValue) return { status: 'correct', value: guessValue || '' }
  // Check for related/close values (e.g., batting hand, bowling style variants)
  const guessLower = (guessValue || '').toLowerCase().trim()
  const targetLower = (targetValue || '').toLowerCase().trim()

  return { status: 'incorrect', value: guessValue || '' }
}

/**
 * Helper to safely extract primary runs (score) from a player object.
 */
export function getPlayerRuns(player) {
  if (!player) return 0
  if (typeof player.runs === 'number') return player.runs
  if (player.runs && typeof player.runs === 'object') {
    return player.runs.odi ?? player.runs.test ?? player.runs.t20i ?? 0
  }
  return 0
}

/**
 * Compare a guessed player's attribute against the target player's attribute.
 * Returns an object with status and direction info for numerical attrs.
 * direction indicates whether the TARGET is higher or lower than the guess.
 */
function compareNumerical(guessValue, targetValue, isRuns = false) {
  const gVal = Number(guessValue) || 0
  const tVal = Number(targetValue) || 0
  const diff = Math.abs(gVal - tVal)

  if (diff === 0) return { status: 'correct', value: gVal, direction: null }

  // Direction indicates whether the TARGET cricketer has a higher (more) or lower (less) value
  const direction = tVal > gVal ? 'higher' : 'lower'

  let status
  if (isRuns) {
    // Relative thresholds for runs (score)
    const rel = tVal > 0 ? diff / tVal : diff
    if (rel <= 0.1 || diff <= 500) {
      status = 'close'
    } else if (rel <= 0.25 || diff <= 2000) {
      status = 'moderate'
    } else {
      status = 'different'
    }
  } else {
    // Thresholds: 0-2 = close, 3-5 = moderate, >5 = far
    if (diff <= 2) {
      status = 'close'
    } else if (diff <= 5) {
      status = 'moderate'
    } else {
      status = 'different'
    }
  }

  return { status, value: gVal, direction }
}

/**
 * Main comparison function.
 * Takes guess player ID (or object) and target player ID (or object).
 * Returns structured comparison result.
 */
export function comparePlayers(guessIdOrObj, targetIdOrObj) {
  let guess = guessIdOrObj
  let target = targetIdOrObj

  // Resolve to player objects if strings/IDs provided
  if (typeof guess === 'string') {
    guess = findPlayerById(guess)
  }
  if (typeof target === 'string') {
    target = findPlayerById(target)
  }

  if (!guess || !target) {
    throw new Error('Invalid player ID(s) provided')
  }

  const result = {
    country: compareCategorical(guess.country, target.country),
    role: compareCategorical(guess.role, target.role),
    battingStyle: compareCategorical(guess.battingStyle, target.battingStyle),
    bowlingStyle: compareCategorical(guess.bowlingStyle, target.bowlingStyle),
    age: compareNumerical(guess.dateOfBirth ? calculateAge(guess.dateOfBirth) : 0, target.dateOfBirth ? calculateAge(target.dateOfBirth) : 0, false),
    debutYear: compareNumerical(guess.debutYear || 0, target.debutYear || 0, false),
    matches: compareNumerical(guess.matches?.test ?? guess.matches?.odi ?? 0, target.matches?.test ?? target.matches?.odi ?? 0, true),
    runs: compareNumerical(getPlayerRuns(guess), getPlayerRuns(target), true), // primary runs (score)
    wickets: compareNumerical(guess.wickets?.odi ?? 0, target.wickets?.odi ?? 0, false),
    similarityScore: 0, // will be calculated below
  }

  // Calculate similarity score (0-100)
  result.similarityScore = calculateSimilarityScore(result)

  return result
}

/**
 * Calculate approximate age from dateOfBirth string (YYYY-MM-DD).
 */
function calculateAge(dateString) {
  if (!dateString) return 0
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/**
 * Calculate overall similarity score from 0-100 based on comparison results.
 */
function calculateSimilarityScore(comparison) {
  let totalScore = 0
  let count = 0

  // Helper to add points based on status
  const addPoints = (status) => {
    count++
    if (status.status === 'correct') totalScore += 25
    else if (status.status === 'close') totalScore += 15
    else if (status.status === 'moderate') totalScore += 8
    else if (status.status === 'incorrect' || status.status === 'different') totalScore += 2
  }

  // Categorical attributes
  addPoints(comparison.country)
  addPoints(comparison.role)
  addPoints(comparison.battingStyle)
  addPoints(comparison.bowlingStyle)

  // Numerical attributes
  addPoints(comparison.age)
  addPoints(comparison.debutYear)
  addPoints(comparison.matches)
  addPoints(comparison.runs)
  addPoints(comparison.wickets)

  // Normalize to 0-100 scale (max possible if all 9 are correct = 9*25 = 225, but we cap at 100)
  const rawScore = (totalScore / (count * 25)) * 100
  return Math.round(rawScore)
}

export default { comparePlayers, findPlayerById, getRandomPlayer, getDailyPlayer }