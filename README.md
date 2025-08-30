# RentNova - Property Rental Management Platform

## 🏠 Overview

RentNova is a modern, comprehensive rental management platform built with Next.js 15, Firebase, and TypeScript. It provides a complete solution for property rentals, featuring role-based dashboards for tenants, landlords, and administrators.

## ✨ Key Features

### 🏡 Property Management
- **Multi-step Property Creation**: 6-step wizard for creating detailed property listings
- **Advanced Search & Filtering**: Location, price, amenities, property type filters
- **Image Gallery Management**: Upload and manage property photos
- **Featured Listings**: Monetized promotional opportunities

### 👥 User Management
- **Role-based Authentication**: Tenant, Landlord, and Admin roles
- **Profile Management**: Complete user profiles with verification
- **Document Management**: Secure document upload and sharing

### 💬 Communication
- **Real-time Messaging**: Built-in chat system between tenants and landlords
- **Application System**: Streamlined rental application process
- **Maintenance Requests**: Ticket system for property maintenance

### 💰 Financial Features
- **Payment Processing**: Integrated payment collection
- **Pricing Tools**: Flexible pricing with deposits and service charges
- **Analytics Dashboard**: Revenue and performance tracking

## 🛠 Technical Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **TanStack Query** for data fetching

### Backend & Database
- **Firebase Firestore** for database
- **Firebase Authentication** for user management
- **Firebase Storage** for file uploads

### UI Components
- **Radix UI** primitives
- **shadcn/ui** component library
- **Lucide React** icons

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Role-based dashboards
│   ├── discover-properties/# Property discovery
│   └── auth/             # Authentication pages
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rentnova
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🎯 TypeScript Safety

This project enforces strict TypeScript safety with:

- **Strict Mode Enabled**: Full TypeScript strict mode
- **Type-safe Firebase**: Comprehensive type definitions for all Firestore collections
- **Form Validation**: Type-safe form handling with proper validation
- **Component Props**: Fully typed component interfaces
- **Constants & Enums**: Type-safe constants and configuration

### Key Type Files
- `src/types/firebase.ts` - Firebase/Firestore type definitions
- `src/types/components.ts` - React component prop types
- `src/types/index.ts` - Central type exports
- `src/lib/constants.ts` - Application constants with types

## 🚀 Features by Role

### 🏠 Landlords
- Property listing creation and management
- Tenant application review
- Maintenance request management
- Revenue analytics and reporting
- Messaging with prospective and current tenants

### 🏘 Tenants
- Property discovery and search
- Application submission with document upload
- Maintenance request submission
- Messaging with landlords
- Favorite properties management

### 👨‍💼 Administrators
- Platform analytics and insights
- User management and verification
- Property moderation and approval
- Content management
- System configuration

## 🎨 Design System

### Color Palette
- Primary: Blue gradient (`from-blue-600 to-purple-600`)
- Secondary: Complementary accent colors
- Neutral: Carefully selected grays for readability

### Components
- Consistent spacing and typography
- Responsive design for all screen sizes
- Accessible form controls and navigation
- Smooth animations and transitions

## 📱 Responsive Design

- **Mobile-first approach**: Optimized for mobile devices
- **Tablet optimization**: Enhanced layouts for tablet screens
- **Desktop experience**: Full-featured desktop interface
- **Cross-browser compatibility**: Tested across major browsers

## 🔒 Security

- **Firebase Authentication**: Secure user authentication
- **Role-based access control**: Proper permission management
- **Data validation**: Client and server-side validation
- **Secure file uploads**: Validated and secured file handling

## 📊 Performance

- **Code splitting**: Automatic route-based code splitting
- **Image optimization**: Next.js image optimization
- **Caching**: Efficient data caching with TanStack Query
- **Bundle optimization**: Minimized bundle sizes

## 🧪 Testing

The project is set up for comprehensive testing:

- **Type checking**: Full TypeScript coverage
- **Component testing**: React component testing setup
- **Integration testing**: End-to-end testing capabilities

## 📈 Analytics

Built-in analytics for:
- Property view tracking
- User engagement metrics
- Revenue and conversion tracking
- Performance monitoring

## 🚀 Deployment

The application is optimized for deployment on:
- **Replit**: Native Replit deployment support
- **Vercel**: Next.js optimized deployment
- **Netlify**: Static and serverless deployment
- **Firebase Hosting**: Native Firebase integration

## 🔄 Version Control

- Clean commit history
- Feature branch workflow
- Automated checks and linting
- Documentation updates

## 📚 Documentation

- Comprehensive code documentation
- Type definitions and interfaces
- Component prop documentation
- API endpoint documentation

## 🤝 Contributing

This project follows clean code principles:
- TypeScript strict mode
- Consistent code formatting
- Comprehensive error handling
- Proper component organization

## 📄 License

This project is proprietary software developed for RentNova.

---

## 🏗 Recent Architectural Changes

### TypeScript Safety Overhaul (Latest)
- Removed unused server and shared directories
- Implemented comprehensive type system
- Added strict TypeScript configuration
- Created centralized constants and type definitions
- Fixed all type errors across the codebase

### Property Management Enhancement
- 6-step property creation wizard
- Type-safe form handling with proper validation
- Image upload and management system
- Price input optimization (no leading zeros, no arrows)

### UI/UX Improvements
- Modern gradient-based design system
- Responsive layouts for all screen sizes
- Consistent component library usage
- Smooth animations and transitions

---

*Built with ❤️ by the RentNova Development Team*