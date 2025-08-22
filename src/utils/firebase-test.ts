import { db } from '@/lib/firebase'
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore'

// Test function to fetch all data from Firebase collections
export async function testFirebaseCollections() {
  console.log('🔥 Testing Firebase Collections...')
  
  try {
    // Test Properties Collection
    console.log('\n📊 PROPERTIES COLLECTION:')
    const propertiesRef = collection(db, 'properties')
    const propertiesQuery = query(propertiesRef, limit(5))
    const propertiesSnapshot = await getDocs(propertiesQuery)
    
    if (!propertiesSnapshot.empty) {
      console.log(`Found ${propertiesSnapshot.size} properties:`)
      propertiesSnapshot.forEach((doc) => {
        console.log('Property ID:', doc.id)
        console.log('Property Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No properties found')
    }

    // Test Tenants Collection
    console.log('\n👥 TENANTS COLLECTION:')
    const tenantsRef = collection(db, 'tenants')
    const tenantsQuery = query(tenantsRef, limit(5))
    const tenantsSnapshot = await getDocs(tenantsQuery)
    
    if (!tenantsSnapshot.empty) {
      console.log(`Found ${tenantsSnapshot.size} tenants:`)
      tenantsSnapshot.forEach((doc) => {
        console.log('Tenant ID:', doc.id)
        console.log('Tenant Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No tenants found')
    }

    // Test Landlords Collection
    console.log('\n🏠 LANDLORDS COLLECTION:')
    const landlordsRef = collection(db, 'landlords')
    const landlordsQuery = query(landlordsRef, limit(5))
    const landlordsSnapshot = await getDocs(landlordsQuery)
    
    if (!landlordsSnapshot.empty) {
      console.log(`Found ${landlordsSnapshot.size} landlords:`)
      landlordsSnapshot.forEach((doc) => {
        console.log('Landlord ID:', doc.id)
        console.log('Landlord Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No landlords found')
    }

    // Test Chat Rooms Collection
    console.log('\n💬 CHAT_ROOMS COLLECTION:')
    const chatRoomsRef = collection(db, 'chat_rooms')
    const chatRoomsQuery = query(chatRoomsRef, limit(5))
    const chatRoomsSnapshot = await getDocs(chatRoomsQuery)
    
    if (!chatRoomsSnapshot.empty) {
      console.log(`Found ${chatRoomsSnapshot.size} chat rooms:`)
      chatRoomsSnapshot.forEach((doc) => {
        console.log('Chat Room ID:', doc.id)
        console.log('Chat Room Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No chat rooms found')
    }

    // Test Chats Collection (legacy)
    console.log('\n💭 CHATS COLLECTION:')
    const chatsRef = collection(db, 'chats')
    const chatsQuery = query(chatsRef, limit(5))
    const chatsSnapshot = await getDocs(chatsQuery)
    
    if (!chatsSnapshot.empty) {
      console.log(`Found ${chatsSnapshot.size} chats:`)
      chatsSnapshot.forEach((doc) => {
        console.log('Chat ID:', doc.id)
        console.log('Chat Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No chats found')
    }

    // Test Payments Collection
    console.log('\n💳 PAYMENTS COLLECTION:')
    const paymentsRef = collection(db, 'payments')
    const paymentsQuery = query(paymentsRef, limit(5))
    const paymentsSnapshot = await getDocs(paymentsQuery)
    
    if (!paymentsSnapshot.empty) {
      console.log(`Found ${paymentsSnapshot.size} payments:`)
      paymentsSnapshot.forEach((doc) => {
        console.log('Payment ID:', doc.id)
        console.log('Payment Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No payments found')
    }

    // Test Maintenance Requests Collection
    console.log('\n🔧 MAINTENANCE_REQUESTS COLLECTION:')
    const maintenanceRef = collection(db, 'maintenance_requests')
    const maintenanceQuery = query(maintenanceRef, limit(5))
    const maintenanceSnapshot = await getDocs(maintenanceQuery)
    
    if (!maintenanceSnapshot.empty) {
      console.log(`Found ${maintenanceSnapshot.size} maintenance requests:`)
      maintenanceSnapshot.forEach((doc) => {
        console.log('Maintenance Request ID:', doc.id)
        console.log('Maintenance Request Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No maintenance requests found')
    }

    // Test Rental Tracking Collection
    console.log('\n📋 RENTAL_TRACKING COLLECTION:')
    const rentalTrackingRef = collection(db, 'rental_tracking')
    const rentalTrackingQuery = query(rentalTrackingRef, limit(5))
    const rentalTrackingSnapshot = await getDocs(rentalTrackingQuery)
    
    if (!rentalTrackingSnapshot.empty) {
      console.log(`Found ${rentalTrackingSnapshot.size} rental tracking records:`)
      rentalTrackingSnapshot.forEach((doc) => {
        console.log('Rental Tracking ID:', doc.id)
        console.log('Rental Tracking Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No rental tracking records found')
    }

    // Test Support Messages Collection
    console.log('\n📞 SUPPORT_MESSAGES COLLECTION:')
    const supportRef = collection(db, 'support_messages')
    const supportQuery = query(supportRef, limit(5))
    const supportSnapshot = await getDocs(supportQuery)
    
    if (!supportSnapshot.empty) {
      console.log(`Found ${supportSnapshot.size} support messages:`)
      supportSnapshot.forEach((doc) => {
        console.log('Support Message ID:', doc.id)
        console.log('Support Message Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No support messages found')
    }

    // Test Applications Collection (for rental applications)
    console.log('\n📝 APPLICATIONS COLLECTION:')
    const applicationsRef = collection(db, 'applications')
    const applicationsQuery = query(applicationsRef, limit(5))
    const applicationsSnapshot = await getDocs(applicationsQuery)
    
    if (!applicationsSnapshot.empty) {
      console.log(`Found ${applicationsSnapshot.size} applications:`)
      applicationsSnapshot.forEach((doc) => {
        console.log('Application ID:', doc.id)
        console.log('Application Data:', doc.data())
        console.log('---')
      })
    } else {
      console.log('No applications found')
    }

    console.log('\n✅ Firebase collections test completed!')
    
  } catch (error) {
    console.error('❌ Error testing Firebase collections:', error)
  }
}

// Function to get collection statistics
export async function getCollectionStats() {
  const collections = [
    'properties', 'tenants', 'landlords', 'chat_rooms', 'chats', 
    'payments', 'maintenance_requests', 'rental_tracking', 
    'support_messages', 'applications'
  ]
  
  const stats: { [key: string]: number } = {}
  
  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      stats[collectionName] = snapshot.size
    } catch (error) {
      console.error(`Error getting stats for ${collectionName}:`, error)
      stats[collectionName] = 0
    }
  }
  
  return stats
}

// Function to test a specific collection with detailed field analysis
export async function analyzeCollection(collectionName: string) {
  console.log(`\n🔍 ANALYZING ${collectionName.toUpperCase()} COLLECTION:`)
  
  try {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(query(collectionRef, limit(10)))
    
    if (snapshot.empty) {
      console.log(`No documents found in ${collectionName}`)
      return
    }
    
    const allFields = new Set<string>()
    const fieldTypes: { [key: string]: Set<string> } = {}
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      Object.keys(data).forEach(field => {
        allFields.add(field)
        if (!fieldTypes[field]) {
          fieldTypes[field] = new Set()
        }
        fieldTypes[field].add(typeof data[field])
      })
    })
    
    console.log(`Total documents: ${snapshot.size}`)
    console.log('Fields found:')
    Array.from(allFields).sort().forEach(field => {
      const types = Array.from(fieldTypes[field]).join(', ')
      console.log(`  - ${field}: ${types}`)
    })
    
    // Show first document as example
    console.log('\nFirst document example:')
    console.log(JSON.stringify(snapshot.docs[0].data(), null, 2))
    
  } catch (error) {
    console.error(`Error analyzing ${collectionName}:`, error)
  }
}