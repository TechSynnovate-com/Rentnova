'use client'

import { useState } from 'react'
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  Linkedin,
  MessageCircle,
  Mail
} from 'lucide-react'
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

interface ShareDropdownProps {
  url: string
  title: string
  description: string
  className?: string
}

export default function ShareDropdown({ url, title, description, className }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(url).then(() => {
          toast.success('Link copied to clipboard!')
          setIsOpen(false)
        })
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        setIsOpen(false)
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
        setIsOpen(false)
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        window.open(linkedinUrl, '_blank', 'width=600,height=400')
        setIsOpen(false)
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
      }
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
        window.location.href = emailUrl
        setIsOpen(false)
      }
    }
  ]

  // Try native sharing first on mobile devices
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
        return true
      } catch (error) {
        // User cancelled sharing or sharing failed
        return false
      }
    }
    return false
  }

  const handleShare = async () => {
    const nativeShared = await handleNativeShare()
    if (!nativeShared) {
      setIsOpen(true)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShare}
          className={className}
        >
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
  )
}