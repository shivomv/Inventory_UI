# PrintFlow Frontend

A modern, responsive frontend application for paper printing company inventory management system built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## 🎯 Demo Mode - No API Required!

This application runs in **demo mode** with mock authentication and data. No backend server or database setup needed!

## 🚀 Features

### Core Functionality
- **Dashboard**: Overview of printing operations with real-time statistics
- **Paper Stock Management**: Manage different paper types, sizes, and quantities
- **Ink & Supplies Management**: Track ink cartridges, toner, and printing supplies
- **Print Jobs Management**: Handle print orders, job queues, and scheduling
- **Production Management**: Manage press operations, finishing, and quality control
- **Client Management**: Maintain customer and supplier information
- **Reports**: Generate printing business and inventory reports
- **Analytics**: Visual insights with charts and performance metrics

### Technical Features
- **Mock Authentication**: Demo login system (no real API calls)
- **Global Search**: Fast, intelligent search across all modules
- **Advanced Filtering**: Customizable filters for all data views
- **Responsive Design**: Mobile-first design that works on all devices
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, professional interface with shadcn/ui components

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3.4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5175`

4. **Login with demo credentials**
   - Username: `demo` / Password: `demo`
   - Or use any username/password combination

## 🔐 Authentication

**Demo Mode Features:**
- No real API server required
- Mock JWT token authentication
- Any username/password combination works
- All data is mocked and stored locally
- Perfect for testing and demonstration

## 📊 Key Features

- **Global Search**: Search across paper types, supplies, print jobs, and clients
- **Advanced Filtering**: Customizable filters for all data views
- **Real-time Dashboard**: Live printing operations metrics and alerts
- **Interactive Charts**: Analytics and reporting with Recharts
- **Mobile Optimized**: Works seamlessly on all devices
- **Mock Data**: Realistic sample data for printing company operations

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/              # Page components
├── services/           # API services (mocked)
├── types/              # TypeScript definitions
└── lib/                # Utility functions
```

## 🚀 Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📱 Mobile Support

Fully responsive design optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)  
- Mobile (320px - 767px)

## 🎨 Customization

The application uses Tailwind CSS for styling. Customize colors and themes in:
- `tailwind.config.js`: Tailwind configuration
- `src/index.css`: Base styles
- Component-level styling with Tailwind classes

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: API base URL (not used in demo mode)
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## 📄 License

MIT License - see LICENSE file for details.
