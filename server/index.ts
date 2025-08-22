import express from 'express'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import routes from './routes'

const app = express()
const server = createServer(app)

// Get current directory (for ES modules)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use(routes)

// Serve static files from client dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist/client')))
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/client/index.html'))
  })
}

const PORT = process.env.PORT || 5000

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

export default app