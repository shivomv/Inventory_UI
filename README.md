# Inventory UI

A modern frontend application for inventory management built with React and Vite.

## Features

- User Authentication
- Dashboard
- Stock Management
- Order Management
- Invoice Generation
- Report Generation
- Filter Management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open in browser:
Navigate to `http://localhost:5175`

4. Login with demo credentials:
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
