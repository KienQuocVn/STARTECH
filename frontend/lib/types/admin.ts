export type ProjectStatus = 'draft' | 'published' | 'archived'
export type LeadStatus = 'new' | 'processing' | 'completed'
export type PageStatus = 'draft' | 'published'

export interface Project {
  id: string
  name: string
  slug: string
  category: string
  description: string
  image: string
  services: string[]
  demoLink?: string
  status: ProjectStatus
  showcase: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: LeadStatus
  notes: string
  createdAt: Date
  updatedAt: Date
  isRead: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
  order: number
}

export interface PricingPlan {
  id: string
  name: string
  price?: number
  contactForPrice: boolean
  featured: boolean
  features: string[]
  order: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export interface Page {
  id: string
  title: string
  slug: string
  sections: PageSection[]
  status: PageStatus
  createdAt: Date
  updatedAt: Date
}

export interface PageSection {
  id: string
  type: 'heading' | 'text' | 'image' | 'list'
  title?: string
  content: string
  order: number
}

export interface Feedback {
  id: string
  name: string
  role: string
  company?: string
  avatar: string
  review: string
  rating: number
  visible: boolean
  createdAt: Date
}

export interface ShowcaseItem {
  id: string
  projectId?: string
  title: string
  link: string
  thumbnail: string
  category: string
  order: number
}

export interface SiteSettings {
  logo: string
  siteName: string
  description: string
  email: string
  phone: string
  address: string
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    zalo?: string
  }
}
