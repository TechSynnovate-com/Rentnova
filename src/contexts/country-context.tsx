'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Country {
  code: string
  name: string
  flag: string
  currency: string
  currencySymbol: string
}

interface CountryContextType {
  selectedCountry: Country
  setSelectedCountry: (country: Country) => void
  formatPrice: (price: number) => string
}

const countries: Country[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    currencySymbol: '₦'
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    currencySymbol: '₵'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R'
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$'
  }
]

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0] || { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦' })

  const formatPrice = (price: number) => {
    const currencyConfig: Record<string, Intl.NumberFormatOptions> = {
      NG: { style: 'currency' as const, currency: 'NGN', minimumFractionDigits: 0 },
      GH: { style: 'currency' as const, currency: 'GHS', minimumFractionDigits: 2 },
      ZA: { style: 'currency' as const, currency: 'ZAR', minimumFractionDigits: 2 },
      US: { style: 'currency' as const, currency: 'USD', minimumFractionDigits: 2 }
    }

    const config = currencyConfig[selectedCountry.code as keyof typeof currencyConfig]
    
    try {
      return new Intl.NumberFormat('en-US', config).format(price)
    } catch (error) {
      return `${selectedCountry.currencySymbol}${price.toLocaleString()}`
    }
  }

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
      formatPrice
    }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}