'use client'

import { useState } from 'react'
import { Heart, Share2, Copy, Facebook, Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'react-hot-toast'

interface SaveShareButtonsProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  onSave?: () => void
  onRemove?: () => void
  isSaved?: boolean
}

export default function SaveShareButtons({ 
  propertyId, 
  propertyTitle, 
  propertyPrice, 
  onSave, 
  onRemove, 
  isSaved = false 
}: SaveShareButtonsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)

  const handleSaveToggle = () => {
    if (isSaved) {
      onRemove?.()
    } else {
      onSave?.()
    }
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${propertyId}`
  const shareText = `Check out this property: ${propertyTitle} - $${propertyPrice.toLocaleString()}/month`

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast.success('Link copied to clipboard!')
          setIsShareOpen(false)
        })
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        setIsShareOpen(false)
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
        setIsShareOpen(false)
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        window.open(linkedinUrl, '_blank', 'width=600,height=400')
        setIsShareOpen(false)
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`
        window.open(whatsappUrl, '_blank')
        setIsShareOpen(false)
      }
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(`${shareText}\n\nView property: ${shareUrl}`)}`
        window.location.href = emailUrl
        setIsShareOpen(false)
      }
    }
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: shareText,
          url: shareUrl
        })
        return true
      } catch (error) {
        return false
      }
    }
    return false
  }

  const handleShare = async () => {
    const nativeShared = await handleNativeShare()
    if (!nativeShared) {
      setIsShareOpen(true)
    }
  }

  return (
    <div className="flex gap-3">
      {/* Save Button */}
      <Button
        variant="outline"
        onClick={handleSaveToggle}
        className={`flex-1 ${isSaved ? 'border-red-500 text-red-500' : ''}`}
      >
        <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        {isSaved ? 'Saved' : 'Save'}
      </Button>

      {/* Share Button */}
      <DropdownMenu open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" onClick={handleShare} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel>Share this property</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {shareOptions.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuItem
                key={option.name}
                onClick={option.action}
                className="cursor-pointer"
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.name}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}