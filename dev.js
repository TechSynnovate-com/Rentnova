#!/usr/bin/env node

const { spawn } = require('child_process')

console.log('Starting Next.js development server...')

const nextProcess = spawn('npx', ['next', 'dev', '--port', '5000', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
})

nextProcess.on('error', (error) => {
  console.error('Error starting Next.js:', error)
  process.exit(1)
})

nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`)
  process.exit(code)
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...')
  nextProcess.kill('SIGINT')
})

process.on('SIGTERM', () => {
  console.log('\nShutting down...')
  nextProcess.kill('SIGTERM')
})