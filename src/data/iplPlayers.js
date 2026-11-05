// src/data/iplPlayers.js
// Loads the cricketers dataset from ipl_player_summary.csv and exposes the
// players in the format used by the game logic and search components.

import csvText from '../../ipl_player_summary.csv?raw'

function parseCSV(text) {
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i]
    if (inQuotes) {
      if (char === '"') {
        if (cleanText[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      field = ''
      rows.push(row)
      row = []
    } else {
      field += char
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.length > 0 && r.some((c) => (c || '').trim() !== ''))
}

function slugify(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cellValue(headers, row, name) {
  const idx = headers.indexOf(name)
  if (idx < 0) return ''
  return (row[idx] || '').trim()
}

function isTrue(value) {
  return ['True', 'true', 'TRUE', '1', 'Yes', 'yes', 'Y'].includes((value || '').trim())
}

function normalizeBattingStyle(style) {
  const raw = (style || '').trim()
  if (!raw) return ''
  const firstWord = raw.toLowerCase().split(/\s+/)[0]
  const hand = firstWord === 'left' ? 'Left' : 'Right'
  return `${hand} Hand`
}

function normalizeBowlingStyle(style) {
  const raw = (style || '').trim()
  if (!raw) return ''
  if (/^(none|nil|nan|n\/a)$/i.test(raw)) return ''
  const words = raw.split(/\s+/).filter(Boolean)
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function toPlayer(row, index, headers) {
  const name = cellValue(headers, row, 'player_full_name') || cellValue(headers, row, 'player_name')
  const id = `${slugify(name)}-${index + 1}`
  const isOverseas = isTrue(cellValue(headers, row, 'is_overseas'))
  const matchesSelected = Number(cellValue(headers, row, 'matches_selected')) || 0
  const runsScored = Number(cellValue(headers, row, 'runs_scored')) || 0
  const wicketsTaken = Number(cellValue(headers, row, 'wickets')) || 0
  const primaryRole = cellValue(headers, row, 'primary_role') || 'Batter'
  const batStyle = normalizeBattingStyle(cellValue(headers, row, 'bat_style'))
  const bowlStyle = normalizeBowlingStyle(cellValue(headers, row, 'bowl_style'))

  return {
    id,
    name,
    country: isOverseas ? 'International' : 'India',
    role: primaryRole,
    battingStyle: batStyle,
    bowlingStyle: bowlStyle,
    dateOfBirth: null,
    debutYear: null,
    formats: [],
    matches: { test: matchesSelected, odi: matchesSelected, t20i: matchesSelected },
    runs: { test: 0, odi: runsScored, t20i: 0 },
    wickets: { test: 0, odi: wicketsTaken, t20i: 0 },
    image: '',
  }
}

const parsed = parseCSV(csvText)
const headers = parsed[0].map((h) => h.trim())
const dataRows = parsed.slice(1).filter((r) => r.some((c) => (c || '').trim() !== ''))

export const players = dataRows.map((row, index) => toPlayer(row, index, headers))

export function findPlayerById(id) {
  return players.find((p) => p.id === id)
}

export function findPlayerByName(name) {
  const lower = (name || '').toLowerCase().trim()
  if (!lower) return undefined
  return players.find((p) => p.name.toLowerCase() === lower)
}

export function getRandomPlayer() {
  const randomIndex = Math.floor(Math.random() * players.length)
  return players[randomIndex]
}

export function getDailyPlayer() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24))
  const index = dayOfYear % players.length
  return players[index]
}

export function searchPlayers(query, limit = 5) {
  const term = (query || '').toLowerCase().trim()
  if (!term) return []
  const startsWith = players.filter((p) => p.name.toLowerCase().startsWith(term))
  const includes = players.filter((p) => p.name.toLowerCase().includes(term))
  return startsWith.length > 0 ? startsWith : includes.slice(0, limit)
}

export default players
