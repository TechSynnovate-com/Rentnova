'use client'


import RecommendationWizard from '@/components/recommendation-wizard'
import { Wand2, Brain, Heart, Target } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full">
                <Wand2 className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Property Recommendations
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our intelligent system analyze your preferences, lifestyle, and needs to find your perfect property match. 
              Get personalized recommendations that truly understand what you're looking for.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Brain className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-blue-100">
                  Advanced algorithms analyze 20+ factors to find properties that match your lifestyle
                </p>
              </motion.div>
              
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Heart className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Personalized</h3>
                <p className="text-sm text-blue-100">
                  Recommendations tailored to your preferences, work style, and family needs
                </p>
              </motion.div>
              
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Target className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Precise Results</h3>
                <p className="text-sm text-blue-100">
                  Get match percentages and detailed reasons why each property suits you
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wizard Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <RecommendationWizard />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Use Our Recommendation Engine?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Save time and find better matches with our intelligent property recommendation system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                Skip endless browsing. Get curated recommendations that match your criteria in minutes.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Matches</h3>
              <p className="text-gray-600">
                Our algorithm considers factors you might miss, ensuring better compatibility.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Understand why properties are recommended with detailed explanations and scoring.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}