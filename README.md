# WriteSpace

A modern blogging platform built with React, featuring user authentication, blog CRUD operations, and an admin dashboard — all powered by localStorage for persistence.

## Tech Stack

- **React 18+** — UI library with hooks and functional components
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **React Router v6** — Client-side routing
- **localStorage** — Browser-based data persistence

## Folder Structure

```
writespace/
├── public/
│   └── vite.svg
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── BlogCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── contexts/          # React context providers
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useBlogs.js
│   │   └── useLocalStorage.js
│   ├── pages/             # Route-level page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── BlogListPage.jsx
│   │   ├── BlogDetailPage.jsx
│   │   ├── CreateBlogPage.jsx
│   │   ├── EditBlogPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/          # Data access layer (localStorage)
│   │   ├── authService.js
│   │   └── blogService.js
│   ├── utils/             # Shared utility functions
│   │   └── helpers.js
│   ├── App.jsx            # Root component with router
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind directives and global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 16+ installed
- **npm** 8+ installed

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Default Admin Credentials

On first launch, a default admin account is automatically seeded:

- **Email:** `admin@writespace.com`
- **Password:** `admin123`

Use these credentials to log in and access the admin dashboard.

### Registration Flow

1. Navigate to the **Register** page from the header.
2. Fill in your name, email, and password.
3. Upon successful registration, you will be automatically logged in and redirected to the home page.
4. New accounts are created with a **user** role by default.

### Blog CRUD

- **Create:** Logged-in users can create new blog posts via the "Create Post" button. Fill in the title, content, and optional tags.
- **Read:** All visitors can browse and read published blog posts on the home page and blog list page.
- **Update:** Authors can edit their own blog posts from the dashboard or blog detail page.
- **Delete:** Authors can delete their own blog posts. Admins can delete any post.

### Admin Features

Admins have access to the **Admin Dashboard**, which includes:

- **User Management:** View all registered users, promote users to admin, or remove accounts.
- **Blog Moderation:** View, edit, or delete any blog post across the platform.
- **Statistics:** Overview of total users, total posts, and recent activity.

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Option 2: Git Integration

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### SPA Routing Configuration

For client-side routing to work on Vercel, add a `vercel.json` file to the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React Router instead of returning 404 errors.

## Environment Variables

This project uses localStorage for all data persistence and does not require any external API keys or environment variables. If you extend the project with external services, prefix all environment variables with `VITE_`:

```bash
VITE_API_URL=https://api.example.com
```

Access them in code via `import.meta.env.VITE_API_URL`.

## License

Private — All rights reserved.