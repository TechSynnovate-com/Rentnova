import { Router } from 'express'
import { z } from 'zod'
import { storage } from './storage'
import { propertySchema, applicationSchema, userSchema } from '@shared/schema'

const router = Router()

// User routes
router.post('/api/users', async (req, res) => {
  try {
    const userData = userSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body)
    const user = await storage.createUser(userData)
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Invalid user data' })
  }
})

router.get('/api/users/:id', async (req, res) => {
  try {
    const user = await storage.getUserById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Property routes
router.post('/api/properties', async (req, res) => {
  try {
    const propertyData = propertySchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body)
    const property = await storage.createProperty(propertyData)
    res.json(property)
  } catch (error) {
    res.status(400).json({ error: 'Invalid property data' })
  }
})

router.get('/api/properties', async (req, res) => {
  try {
    const filters = {
      landlordId: req.query.landlordId as string,
      featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined
    }
    const properties = await storage.getProperties(filters)
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await storage.getPropertyById(req.params.id)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json(property)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/api/properties/:id', async (req, res) => {
  try {
    const updates = propertySchema.partial().parse(req.body)
    const property = await storage.updateProperty(req.params.id, updates)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json(property)
  } catch (error) {
    res.status(400).json({ error: 'Invalid property data' })
  }
})

router.delete('/api/properties/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteProperty(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Application routes
router.post('/api/applications', async (req, res) => {
  try {
    const applicationData = applicationSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body)
    const application = await storage.createApplication(applicationData)
    res.json(application)
  } catch (error) {
    res.status(400).json({ error: 'Invalid application data' })
  }
})

router.get('/api/applications', async (req, res) => {
  try {
    const filters = {
      propertyId: req.query.propertyId as string,
      tenantId: req.query.tenantId as string,
      landlordId: req.query.landlordId as string
    }
    const applications = await storage.getApplications(filters)
    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await storage.getApplicationById(req.params.id)
    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }
    res.json(application)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/api/applications/:id', async (req, res) => {
  try {
    const updates = applicationSchema.partial().parse(req.body)
    const application = await storage.updateApplication(req.params.id, updates)
    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }
    res.json(application)
  } catch (error) {
    res.status(400).json({ error: 'Invalid application data' })
  }
})

router.delete('/api/applications/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteApplication(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router