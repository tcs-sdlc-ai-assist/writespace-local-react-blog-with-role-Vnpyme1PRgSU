# Changelog

All notable changes to the **WriteSpace** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

- **Public Landing Page**
  - Hero section with call-to-action for new visitors
  - Featured blog posts displayed on the homepage
  - Fully responsive layout optimized for all screen sizes

- **Authentication System**
  - User registration with form validation
  - User login with credential verification
  - Protected route handling for authenticated users
  - Session persistence using localStorage

- **Role-Based Access Control**
  - Support for `admin` and `user` roles
  - Route guards restricting access based on user role
  - Role-aware navigation rendering

- **Blog CRUD Operations**
  - Create new blog posts with title, content, and metadata
  - Read and browse all published blog posts
  - Update existing blog posts (author and admin only)
  - Delete blog posts (author and admin only)
  - Individual blog post detail view

- **Admin Dashboard**
  - Overview panel with key metrics and statistics
  - Manage all blog posts across the platform
  - Quick actions for content moderation

- **User Management**
  - Admin ability to view all registered users
  - Admin ability to assign or change user roles
  - Admin ability to remove user accounts

- **localStorage Persistence**
  - User session data persisted across browser refreshes
  - Blog post data stored locally for offline-capable reading
  - Automatic state rehydration on application load

- **Responsive Tailwind UI**
  - Mobile-first design using Tailwind CSS utility classes
  - Responsive navigation with mobile hamburger menu
  - Dark-mode-ready component structure
  - Consistent spacing, typography, and color palette

- **Vercel Deployment Configuration**
  - `vercel.json` configured for SPA client-side routing
  - Rewrite rules ensuring all routes resolve to `index.html`
  - Optimized production build via Vite