// src/utils/gameLogic.js

import { players } from '../data/players'

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
  if (guessValue === targetValue) return { status: 'correct', value: guessValue }
  // Check for related/close values (e.g., batting hand, bowling style variants)
  const guessLower = guessValue.toLowerCase().trim()
  const targetLower = targetValue.toLowerCase().trim()

  // Some simple related checks:
  // - Right Hand vs Left Hand are different but could be considered "related" if the target is one and guess is other -> we treat as different (incorrect) to keep it strict
  // - Bowling style: fast vs medium could be considered close, but we'll keep strict match

  return { status: 'incorrect', value: guessValue }
}

/**
 * Compare a guessed player's attribute against the target player's attribute.
 * Returns an object with status and direction info for numerical attrs.
 */
function compareNumerical(guessValue, targetValue) {
  const diff = Math.abs(guessValue - targetValue)

  if (diff === 0) return { status: 'correct', value: guessValue, direction: null }

  // Define thresholds for closeness
  // For age, debut year, runs, wickets, matches
  let status
  let direction // 'higher' if guess > target, 'lower' if guess < target

  if (guessValue > targetValue) {
    direction = 'higher'
  } else {
    direction = 'lower'
  }

  // Thresholds: 0-2 = close, 3-5 = moderate, >5 = far
  if (diff <= 2) {
    status = 'close'
  } else if (diff <= 5) {
    status = 'moderate'
  } else {
    status = 'different'
  }

  return { status, value: guessValue, direction }
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
    age: compareNumerical(guess.dateOfBirth ? calculateAge(guess.dateOfBirth) : 0, target.dateOfBirth ? calculateAge(target.dateOfBirth) : 0),
    debutYear: compareNumerical(guess.debutYear, target.debutYear),
    matches: compareNumerical(guess.matches.test, target.matches.test),
    runs: compareNumerical(guess.runs.odi, target.runs.odi), // using ODI runs as primary
    wickets: compareNumerical(guess.wickets.odi, target.wickets.odi),
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