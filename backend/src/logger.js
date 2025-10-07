// Lightweight logger with optional pino. Falls back to console if pino isn't installed.
let logger
try {
  // Attempt to use pino if available
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const pino = require('pino')
  const isProd = process.env.NODE_ENV === 'production'
  let transport
  try {
    if (!isProd) {
      // eslint-disable-next-line global-require
      transport = { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } }
    }
  } catch {
    transport = undefined
  }
  logger = pino({ level: process.env.LOG_LEVEL || 'info' }, transport)
} catch {
  const levelPriority = { error: 0, warn: 1, info: 2, debug: 3 }
  const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase()
  const minLevel = levelPriority[envLevel] ?? 2
  const fmt = (lvl, args) => {
    const ts = new Date().toISOString()
    // eslint-disable-next-line no-console
    console.log(`[${ts}] ${lvl.toUpperCase()}:`, ...args)
  }
  logger = {
    error: (...args) => { if (minLevel >= 0) fmt('error', args) },
    warn: (...args) => { if (minLevel >= 1) fmt('warn', args) },
    info: (...args) => { if (minLevel >= 2) fmt('info', args) },
    debug: (...args) => { if (minLevel >= 3) fmt('debug', args) },
  }
}

module.exports = logger
