# NeuroFlow AI - Mental Health Support Platform

## Overview

NeuroFlow AI is a comprehensive mental health support platform that provides 24/7 AI-powered therapeutic assistance, mood tracking, crisis resources, and professional therapist connections. The application aims to make mental health care accessible, stigma-free, and available around the clock through an intelligent, empathetic AI companion.

The platform combines modern web technologies with thoughtful mental health design principles, offering users multiple pathways to support including automated crisis detection, mood visualization, and seamless integration with professional mental health services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system for accessible, consistent components
- **Styling**: Tailwind CSS with custom mental health-focused color palette and design tokens
- **State Management**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for full-stack type safety
- **AI Service**: Custom intelligent response system with crisis detection and contextual mental health support
- **Session Management**: Stateless session handling with unique session IDs for chat conversations

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema**: Structured tables for users, chat messages with session-based conversation tracking
- **Migration System**: Drizzle Kit for database schema management and migrations

### Authentication and Authorization
- **Storage Layer**: User authentication system with username/password storage
- **Session Management**: Memory-based storage with fallback for development
- **Security**: Password hashing and user session isolation

### API Design
- **REST Endpoints**: Express.js routes for chat messaging and user management
- **Request/Response**: JSON-based communication with Zod validation schemas
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Logging**: Request/response logging for API monitoring and debugging

### Mental Health Features
- **AI Chat System**: Advanced contextual AI with emotional keyword analysis, crisis detection, and personalized responses
- **Crisis Detection**: Automatic identification of crisis keywords with immediate support resources (988, crisis text line)
- **Mood Tracking**: Visual mood logging with emoji-based rating system and trend analysis
- **Resource Integration**: Built-in crisis support resources and therapist connection tools
- **Session Management**: Unique session IDs for conversation continuity and context awareness

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **UI Framework**: Radix UI component library for accessible primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Routing**: Wouter for lightweight routing solution

### Backend Dependencies
- **Server Framework**: Express.js for REST API server
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon serverless driver
- **Validation**: Zod for runtime type checking and schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Type Checking**: TypeScript compiler with strict configuration
- **Database Tools**: Drizzle Kit for schema management and migrations
- **Replit Integration**: Vite plugins for Replit development environment

### Utility Libraries
- **Date Handling**: date-fns for date formatting and manipulation
- **Class Management**: clsx and tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for component interactions

### Mental Health Integrations
- **Crisis Resources**: International crisis hotline integration (US, UK, other countries)
- **Professional Network**: Therapist directory and connection system
- **Accessibility**: Full WCAG compliance through Radix UI primitives