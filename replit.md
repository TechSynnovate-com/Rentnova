# RentNova - Modern Rental Management Platform

## Overview
RentNova is a comprehensive Next.js rental management platform designed to streamline property listings, tenant applications, lease management, and maintenance requests. It features role-based dashboards for tenants, landlords, and administrators. The platform aims to modernize the rental experience with capabilities like AI-powered recommendations, robust document management, and integrated payment systems, offering a complete solution for the rental market.

## User Preferences
- **Communication Style**: Simple, everyday language
- **Code Quality**: Strict TypeScript safety requirements - ACHIEVED ✅
- **Architecture**: Clean, production-ready codebase with comprehensive documentation
- **Development Standards**: Remove unused files, ensure type safety, and maintain clean code structure
- **Production Requirements**: Zero build warnings and full deployment readiness - COMPLETED ✅

## System Architecture
**Framework & Frontend**: Built with Next.js 15 (App Router) and React 19 (TypeScript) with strict type safety and zero build warnings.
**Styling**: Uses Tailwind CSS v3.4.17 for responsive design and custom gradients.
**Backend**: Leverages Firebase for authentication, Firestore database, and storage.
**Data Management**: Employs TanStack Query v5 for data fetching with 5-minute caching and real-time subscriptions (e.g., for chat). Centralized queries (`properties.ts`, `users.ts`, `chat.ts`) manage data, complemented by React Context for client-side state.
**Production Status**: Successfully achieved production-ready build with complete TypeScript compilation and Next.js static generation (47 routes).
**UI/UX**: Utilizes Radix UI primitives and custom shadcn/ui components for accessibility and a consistent look. Features Framer Motion for smooth animations and micro-interactions.
**Core Features**:
- **Authentication**: Role-based (tenant, landlord, admin) with email/password and profile completion, including identity verification and protected routes.
- **User Dashboards**: Dedicated, responsive dashboards for each user role with relevant functionalities and data overviews.
- **Property Management**: Comprehensive system for landlords to create, list, and manage properties, including a multi-step wizard for property creation. Tenants can discover properties with advanced search, filtering, and AI-powered recommendations.
- **Application & Document Management**: Streamlined tenant application process with document upload (e.g., proof of employment, income, ID) and a workflow for landlords to review and approve applications. Documents uploaded once can be shared with one click.
- **Communication**: Integrated messaging system for tenant-landlord communication.
- **Maintenance**: Tenants can submit maintenance requests with image uploads, and landlords can track and assign service providers.
- **Payments**: Comprehensive payment center for rent collection, processing (card, transfer, USSD), and transaction history.
- **Smart Location Insights**: AI-powered neighborhood analysis with vibe meter, safety scoring, accessibility metrics, and real-time community insights to help tenants understand area dynamics.
- **Rental Compatibility Quiz**: One-click personalized compatibility assessment that matches properties to user preferences, lifestyle, budget, and requirements with detailed recommendations.
- **Admin Capabilities**: Dashboard for platform analytics, user management, property moderation, and content management.
- **Design Principles**: Emphasis on modern, colorful, and responsive designs with gradient effects, ensuring an intuitive and visually appealing user experience across all devices.

## External Dependencies
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- Radix UI
- React Hook Form
- React Hot Toast
- and many more
