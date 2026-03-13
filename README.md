# Synnoviq Technologies — Official Website

A complete, production-ready React website for Synnoviq Technologies Pvt Ltd.

## Tech Stack

- **React 18** + React Router v6
- **Custom CSS** (no UI framework — fully hand-crafted design system)
- **Google Fonts**: Syne (display) + DM Sans (body)
- **Lucide React** for icons

## Design Theme

- **Dark tech aesthetic** with deep navy/black backgrounds
- **Accent colors**: Cyan (#00e5ff), Violet (#7c3aed), Lime (#a3e635)
- **Grid background** with animated noise texture
- **Glassmorphism** cards with glow effects
- Fully **responsive** (mobile, tablet, desktop)

## Pages Included

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Blog | `/blog` |
| Team | `/team` |
| Announcements | `/announcements` |
| Careers | `/careers` |
| Contact | `/contact` |
| Certificate Verification | `/certificate-verification` |

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Outputs optimized static files to the `/build` folder.

## Deployment

The `/build` folder can be deployed to:
- **Vercel** (recommended): `vercel --prod`
- **Netlify**: drag and drop the `/build` folder
- **AWS S3 + CloudFront**
- **Firebase Hosting**

## Customization Guide

### Update Company Info
- Contact email: search `synnoviqtechnologies@gmail.com` across all files
- Location: update in `src/pages/Contact.jsx`
- Team members: update `src/pages/Team.jsx` — replace placeholder names/bios

### Add Real Blog Posts
- Extend the `posts` array in `src/pages/Blog.jsx`
- Create individual post pages with `/blog/:slug` routes

### Certificate Verification API
- Replace the mock `mockCerts` object in `src/pages/CertificateVerification.jsx` with a real API call to your backend

### Contact Form Backend
- In `src/pages/Contact.jsx`, replace the simulated API call with your actual `POST /api/contact` endpoint

### Adding Social Links
- Update the social media hrefs in `src/components/Footer.jsx`

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky navbar with mobile menu
│   └── Footer.jsx        # Multi-column footer
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── About.jsx         # About, mission, vision, values
│   ├── Services.jsx      # Full Stack, Game Dev, UI/UX
│   ├── Blog.jsx          # Blog with category filters
│   ├── Team.jsx          # Team by department
│   ├── Announcements.jsx # Company news
│   ├── Careers.jsx       # Internships + full-time roles
│   ├── Contact.jsx       # Contact form
│   └── CertificateVerification.jsx
├── styles/
│   └── globals.css       # Design tokens + utility classes
├── App.jsx               # Router setup
└── index.js              # Entry point
```

---

Built for **Synnoviq Technologies Pvt Ltd** · © 2025
