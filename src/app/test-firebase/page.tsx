'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { testFirebaseCollections, getCollectionStats, analyzeCollection } from '@/utils/firebase-test'
import { Database, Search, BarChart3, RefreshCw } from 'lucide-react'

export default function TestFirebasePage() {
  const [testing, setTesting] = useState(false)
  const [stats, setStats] = useState<{ [key: string]: number } | null>(null)
  const [analyzing, setAnalyzing] = useState('')

  const handleTestCollections = async () => {
    setTesting(true)
    try {
      await testFirebaseCollections()
      console.log('Test completed - check browser console for detailed results')
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setTesting(false)
    }
  }

  const handleGetStats = async () => {
    try {
      const collectionStats = await getCollectionStats()
      setStats(collectionStats)
      console.log('Collection Statistics:', collectionStats)
    } catch (error) {
      console.error('Failed to get stats:', error)
    }
  }

  const handleAnalyzeCollection = async (collectionName: string) => {
    setAnalyzing(collectionName)
    try {
      await analyzeCollection(collectionName)
      console.log(`Analysis of ${collectionName} completed - check browser console for details`)
    } catch (error) {
      console.error(`Failed to analyze ${collectionName}:`, error)
    } finally {
      setAnalyzing('')
    }
  }

  const collections = [
    { name: 'properties', description: 'Property listings for rent' },
    { name: 'tenants', description: 'Tenant user profiles' },
    { name: 'landlords', description: 'Landlord user profiles' },
    { name: 'chat_rooms', description: 'Chat conversations between users' },
    { name: 'chats', description: 'Legacy chat system' },
    { name: 'payments', description: 'Payment records for rentals' },
    { name: 'maintenance_requests', description: 'Maintenance requests from tenants' },
    { name: 'rental_tracking', description: 'Active rental agreements tracking' },
    { name: 'support_messages', description: 'Customer support messages' },
    { name: 'applications', description: 'Rental applications from tenants' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firebase Collections Test</h1>
          <p className="text-gray-600">Test and analyze Firebase collections to understand data structure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Test All Collections
              </CardTitle>
              <CardDescription>
                Fetch sample data from all Firebase collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestCollections} 
                disabled={testing}
                className="w-full"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Run Test'
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Results will appear in browser console
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Collection Statistics
              </CardTitle>
              <CardDescription>
                Get document counts for all collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGetStats} className="w-full mb-3">
                Get Statistics
              </Button>
              {stats && (
                <div className="text-sm space-y-1">
                  {Object.entries(stats).map(([collection, count]) => (
                    <div key={collection} className="flex justify-between">
                      <span className="text-gray-600">{collection}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Live Console
              </CardTitle>
              <CardDescription>
                Open browser console to see detailed results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  console.clear()
                  console.log('🔥 Firebase Test Console Ready')
                }}
                variant="outline"
                className="w-full"
              >
                Clear Console
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <Card key={collection.name}>
              <CardHeader>
                <CardTitle className="text-lg">{collection.name}</CardTitle>
                <CardDescription>{collection.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAnalyzeCollection(collection.name)}
                    disabled={analyzing === collection.name}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    {analyzing === collection.name ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Fields'
                    )}
                  </Button>
                  {stats && (
                    <div className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm">
                      {stats[collection.name] || 0} docs
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Open browser Developer Tools (F12) and go to Console tab</li>
            <li>2. Click "Run Test" to fetch sample data from all collections</li>
            <li>3. Use "Get Statistics" to see document counts</li>
            <li>4. Analyze individual collections to see their field structure</li>
            <li>5. Check console for detailed data structure and field types</li>
          </ol>
        </div>
      </div>
    </div>
  )
}