'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth-context'
import { CountryProvider } from '@/contexts/country-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <CountryProvider>
            <FavoritesProvider>
              {children}
              <Toaster position="top-right" />
            </FavoritesProvider>
          </CountryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}