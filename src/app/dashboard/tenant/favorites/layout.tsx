import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites - RentNova',
  description: 'View and manage your saved properties',
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}