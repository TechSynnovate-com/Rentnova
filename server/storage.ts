import { Property, Application, User } from '@shared/schema'

export interface IStorage {
  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUser(id: string, updates: Partial<User>): Promise<User | null>
  
  // Property operations
  createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>
  getPropertyById(id: string): Promise<Property | null>
  getProperties(filters?: { landlordId?: string; featured?: boolean }): Promise<Property[]>
  updateProperty(id: string, updates: Partial<Property>): Promise<Property | null>
  deleteProperty(id: string): Promise<boolean>
  
  // Application operations
  createApplication(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application>
  getApplicationById(id: string): Promise<Application | null>
  getApplications(filters?: { propertyId?: string; tenantId?: string; landlordId?: string }): Promise<Application[]>
  updateApplication(id: string, updates: Partial<Application>): Promise<Application | null>
  deleteApplication(id: string): Promise<boolean>
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map()
  private properties: Map<string, Property> = new Map()
  private applications: Map<string, Application> = new Map()

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Property operations
  async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const property: Property = {
      ...propertyData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.properties.set(property.id, property)
    return property
  }

  async getPropertyById(id: string): Promise<Property | null> {
    return this.properties.get(id) || null
  }

  async getProperties(filters?: { landlordId?: string; featured?: boolean }): Promise<Property[]> {
    let properties = Array.from(this.properties.values())
    
    if (filters?.landlordId) {
      properties = properties.filter(p => p.landlordId === filters.landlordId)
    }
    
    if (filters?.featured !== undefined) {
      properties = properties.filter(p => p.featured === filters.featured)
    }
    
    return properties
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const property = this.properties.get(id)
    if (!property) return null

    const updatedProperty = { ...property, ...updates, updatedAt: new Date() }
    this.properties.set(id, updatedProperty)
    return updatedProperty
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id)
  }

  // Application operations
  async createApplication(applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const application: Application = {
      ...applicationData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.applications.set(application.id, application)
    return application
  }

  async getApplicationById(id: string): Promise<Application | null> {
    return this.applications.get(id) || null
  }

  async getApplications(filters?: { propertyId?: string; tenantId?: string; landlordId?: string }): Promise<Application[]> {
    let applications = Array.from(this.applications.values())
    
    if (filters?.propertyId) {
      applications = applications.filter(a => a.propertyId === filters.propertyId)
    }
    
    if (filters?.tenantId) {
      applications = applications.filter(a => a.tenantId === filters.tenantId)
    }
    
    if (filters?.landlordId) {
      applications = applications.filter(a => a.landlordId === filters.landlordId)
    }
    
    return applications
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
    const application = this.applications.get(id)
    if (!application) return null

    const updatedApplication = { ...application, ...updates, updatedAt: new Date() }
    this.applications.set(id, updatedApplication)
    return updatedApplication
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id)
  }
}

export const storage = new MemStorage()