# Sahaya Pragathi - Government Service Management System

A comprehensive government service management platform built with React, TypeScript, and modern web technologies to streamline citizen services and administrative operations.

## 🌟 Project Overview

**Sahaya Pragathi** is a full-stack government service portal that enables:

- **Citizens** to submit requests, book appointments, and track service status
- **Government Officials** to manage, assign, and resolve citizen requests efficiently
- **Administrators** to oversee operations, manage users, and generate reports

## 🚀 Features

### Citizen Portal

- **Grievance Submission** - Report issues with government services and infrastructure
- **Appointment Booking** - Schedule meetings with government officials
- **Emergency Support** - Request immediate assistance with GPS location tracking
- **Dispute Resolution** - File and track dispute mediation requests
- **Temple Darshan Letters** - Request VIP/General darshan letters
- **CM Relief Fund** - Apply for medical treatment support
- **Education Support** - Request education recommendations and fee concessions
- **CSR & Industrial Relations** - Submit corporate partnership proposals

### Executive Dashboard

- **Real-time Analytics** - Monitor cases, SLA compliance, and performance metrics
- **Case Management** - Review, assign, and track all service requests
- **District Heatmap** - Visualize case distribution across regions
- **Priority Management** - Handle urgent cases with P1-P4 priority system
- **Status Tracking** - Track cases through their complete lifecycle

### Administrative Features

- **User Management** - Manage government officials and access controls
- **Master Data** - Configure departments, districts, categories, and priorities
- **Bulk Operations** - Approve, assign, or update multiple cases simultaneously
- **Reporting** - Generate comprehensive reports and analytics
- **Task Wizard** - Create and assign tasks with automated workflows

## 🛠️ Technologies

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization
- **Lucide Icons** - Modern icon library

### State Management & Forms

- **Context API** - Global state management
- **React Hook Form** - Form handling (if used)
- **Toast Notifications** - User feedback system

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Backend API** running on `http://localhost:5000`

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Waseem-Baig/sahaya-pragathi.git
cd sahaya-pragathi/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:8080`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── admin/             # Admin dashboard components
│   │   ├── dashboard/         # KPI widgets and analytics
│   │   ├── forms/             # Service request forms
│   │   │   ├── GrievanceForm.tsx
│   │   │   ├── AppointmentBookingForm.tsx
│   │   │   ├── EmergencySupportForm.tsx
│   │   │   ├── DisputeForm.tsx
│   │   │   ├── TempleLetterForm.tsx
│   │   │   ├── CMRFForm.tsx
│   │   │   ├── EducationSupportForm.tsx
│   │   │   └── CSRIndustrialForm.tsx
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Reusable UI components
│   │   ├── CitizenPortal.tsx  # Citizen dashboard
│   │   ├── ExecutiveDashboard.tsx
│   │   └── LeadershipCockpit.tsx
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── api.ts             # API client and endpoints
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # Page components
│   ├── types/                 # TypeScript type definitions
│   └── App.tsx                # Root component
├── public/                    # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎯 Available Scripts

### Development

```bash
npm run dev          # Start development server with hot reload
```

### Build

```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🔐 User Roles & Permissions

| Role                      | Access Level | Capabilities                                     |
| ------------------------- | ------------ | ------------------------------------------------ |
| **Citizen**               | Public       | Submit requests, track status, book appointments |
| **L3 - Field Officer**    | Basic        | View and update assigned cases                   |
| **L2 - Department Head**  | Medium       | Assign cases, approve L3 actions                 |
| **L1 - District Officer** | High         | Manage district operations, final approvals      |
| **Executive**             | Dashboard    | View analytics, monitor performance              |
| **Admin**                 | Full         | User management, system configuration            |
| **Master Admin**          | Complete     | All administrative functions                     |

## 📊 Key Features Details

### Multi-Step Forms

All service forms use a step-by-step wizard approach with:

- **Progress indicators** - Visual feedback on completion
- **Field validation** - Real-time error checking
- **Auto-save** - Prevent data loss (planned)
- **Review step** - Final confirmation before submission

### Real-Time Updates

- Live case status updates
- Instant notifications for assignments
- Dashboard auto-refresh

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Accessible UI components

### Security

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes
- Secure API communication

## 🌐 API Integration

The frontend communicates with the backend API through centralized API client (`src/lib/api.ts`) with endpoints for:

- **Cases** - Grievances and service requests
- **Appointments** - Meeting scheduling
- **Emergencies** - Urgent support requests
- **Disputes** - Mediation cases
- **Temples** - Darshan letter requests
- **CM Relief** - Medical fund applications
- **Education** - Support requests
- **CSR Industrial** - Partnership proposals
- **Users** - Authentication and management

## 🎨 UI Components

Built with **shadcn/ui** providing:

- Buttons, Cards, Dialogs
- Forms, Inputs, Select boxes
- Tables, Badges, Progress bars
- Tooltips, Popups, Modals
- Custom government-themed variants

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deploy Options

- **Vercel** - Recommended for Vite projects
- **Netlify** - Simple deployment with CI/CD
- **GitHub Pages** - Free static hosting
- **Self-hosted** - Nginx/Apache server

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC License - see LICENSE file for details

## 👥 Team

**Waseem-Baig** - Project Lead & Developer

## 📞 Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/Waseem-Baig/sahaya-pragathi/issues)
- Email: support@gov.ap.in (demo)

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Citizen portal with 8 service forms
  - Executive dashboard with analytics
  - Admin panel for user management
  - Complete authentication system

---

**Note**: This is a government service management system. Ensure proper security measures and compliance with data protection regulations before deployment.
