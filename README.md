# PredictCup - Football Prediction Platform

A modern, responsive web application for predicting football match outcomes and competing on global leaderboards. Built with React, Node.js, PostgreSQL, and Docker.

## 🎯 Features

- ✅ **Match Predictions**: Predict match results before kickoff
- 📊 **Live Scores**: Real-time match status and scores from football API
- 🏆 **Leaderboard**: Compete with other users globally
- 🎮 **Multiple Tournaments**: World Cup, Champions League, League matches
- 👤 **User Authentication**: Secure JWT-based registration and login
- 📈 **Automatic Scoring**: Points calculated based on prediction accuracy
- ⚙️ **Admin Dashboard**: Tournament and competition management
- 📱 **Responsive Design**: Mobile-first UI with Tailwind CSS
- 🌍 **Multi-language**: Arabic and English support with full RTL
- 🐳 **Docker Ready**: Complete Docker and Docker Compose setup

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Query** for data fetching and caching
- **Socket.io-client** for real-time updates
- **Axios** for HTTP requests
- **i18next** for internationalization (Arabic/English)
- **Zod** for schema validation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Prisma** as ORM
- **JWT** for authentication
- **Socket.io** for WebSocket connections
- **Class-based architecture** for clean, maintainable code
- **Football API provider abstraction** for easy switching
- **Helmet** for security headers
- **Rate limiting** for API protection

### DevOps
- **Docker** for containerization
- **Docker Compose** for orchestration
- **PostgreSQL** in Docker
- **Redis** for caching (optional)

## 📁 Project Structure

```
predictcup/
├── frontend/                           # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── matches/
│   │   │   ├── leaderboard/
│   │   │   └── admin/
│   │   ├── pages/                      # Page components
│   │   ├── services/                   # API clients and services
│   │   ├── store/                      # Redux slices and store
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── utils/                      # Utility functions
│   │   ├── i18n/                       # i18next configuration
│   │   ├── styles/                     # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                            # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/                # Request handlers
│   │   ├── services/                   # Business logic
│   │   ├── models/                     # Database models (Prisma)
│   │   ├── routes/                     # API routes
│   │   ├── middleware/                 # Express middleware
│   │   ├── utils/                      # Utility functions
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── config/                     # Configuration files
│   │   ├── football/                   # Football API abstraction
│   │   │   ├── providers/
│   │   │   ├── interfaces/
│   │   │   └── factory.ts
│   │   ├── email/                      # Email service abstraction
│   │   │   ├── providers/
│   │   │   ├── interfaces/
│   │   │   └── factory.ts
│   │   ├── websocket/                  # WebSocket handlers
│   │   ├── logger/                     # Structured logging
│   │   └── server.ts                   # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma               # Prisma schema
│   │   └── migrations/                 # Database migrations
│   ├── scripts/
│   │   └── seed.ts                     # Database seeding
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                  # Docker services orchestration
├── .gitignore
├── LICENSE
└── CONTRIBUTING.md
```

## 🚀 Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/ssAOkka/predictcup.git
cd predictcup

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure Football API (optional, can test without)
# Edit backend/.env and add your FOOTBALL_API_KEY

# Start all services
docker-compose up

# Run migrations (in another terminal)
docker-compose exec backend npm run migrate

# Seed database with default admin
docker-compose exec backend npm run seed

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# PostgreSQL: localhost:5432
```

## 🔐 Environment Variables

### Backend (.env.example)

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://predictcup:predictcup@postgres:5432/predictcup

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Football API
FOOTBALL_API_PROVIDER=football-data.org
FOOTBALL_API_KEY=your-api-key-here

# Email Service
EMAIL_PROVIDER=nodemailer
EMAIL_FROM=noreply@predictcup.dev
# Nodemailer (development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# CORS
CORS_ORIGIN=http://localhost:5173

# WebSocket
WS_URL=http://localhost:3000

# Admin Account (seeding)
ADMIN_EMAIL=admin@predictcup.dev
ADMIN_PASSWORD=ChangeMe123!
ADMIN_USERNAME=admin

# Logging
LOG_LEVEL=info
```

### Frontend (.env.example)

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
VITE_APP_NAME=PredictCup
VITE_DEFAULT_LANGUAGE=en
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user
```

### Match Endpoints

```
GET    /api/matches                - Get upcoming matches (paginated)
GET    /api/matches/:id            - Get match details
GET    /api/matches/tournament/:id  - Get matches by tournament
```

### Prediction Endpoints

```
POST   /api/predictions            - Create prediction
GET    /api/predictions            - Get user's predictions
PUT    /api/predictions/:id        - Update prediction
GET    /api/predictions/match/:id   - Get predictions for a match
```

### User Endpoints

```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
GET    /api/users/leaderboard      - Get global leaderboard
GET    /api/users/:id/stats        - Get user statistics
```

### Tournament Endpoints

```
GET    /api/tournaments            - Get all tournaments
GET    /api/tournaments/:id        - Get tournament details
GET    /api/tournaments/:id/matches - Get tournament matches
```

### Admin Endpoints

```
POST   /api/admin/tournaments      - Create tournament
PUT    /api/admin/tournaments/:id  - Update tournament
DELETE /api/admin/tournaments/:id  - Delete tournament
GET    /api/admin/users            - List all users
PUT    /api/admin/users/:id        - Update user role
DELETE /api/admin/users/:id        - Delete user
GET    /api/admin/stats            - Get platform statistics
```

## 🏛️ Architecture Highlights

### Football API Provider Pattern

Easily switch between providers:

```typescript
// Abstraction layer
interface IFootballProvider {
  getMatches(): Promise<Match[]>;
  getMatchDetails(id: string): Promise<Match>;
  updateScores(): Promise<void>;
}

// Implementation 1: Football-Data.org
class FootballDataProvider implements IFootballProvider { }

// Implementation 2: API-Football (future)
class APIFootballProvider implements IFootballProvider { }

// Factory pattern for easy switching
const provider = FootballProviderFactory.create(
  process.env.FOOTBALL_API_PROVIDER
);
```

### Email Service Abstraction

Switch email providers without changing business logic:

```typescript
interface IEmailService {
  sendPasswordReset(email: string, token: string): Promise<void>;
  sendWelcome(email: string, username: string): Promise<void>;
}

// Implementation 1: Nodemailer (development)
// Implementation 2: SendGrid (production)
// Implementation 3: Resend (production)
```

## 🔐 Security Features

- ✅ **JWT Authentication** with refresh token rotation
- ✅ **Password Hashing** with bcrypt
- ✅ **Input Validation** with Zod schemas
- ✅ **CORS Protection** with configurable origins
- ✅ **Rate Limiting** on API endpoints
- ✅ **Security Headers** with Helmet
- ✅ **Structured Logging** for audit trails
- ✅ **Centralized Error Handling**
- ✅ **Forced password change** on first admin login

## 🌐 Internationalization

- English and Arabic with equal priority
- Full RTL support for Arabic UI
- All user-facing text externalized
- Language switching at runtime
- Community translation support planned

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:coverage

# End-to-end tests
npm run test:e2e
```

## 📦 Deployment

### Docker Compose (Development)

```bash
docker-compose up
```

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Cloud deployment (AWS, GCP, Azure, DigitalOcean)
- CI/CD pipeline setup
- Database backups
- SSL/TLS configuration

## 🤝 Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@predictcup.dev
- 🐛 Issues: [GitHub Issues](https://github.com/ssAOkka/predictcup/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ssAOkka/predictcup/discussions)

## 🗺️ Roadmap

- [ ] Real-time notifications (Email/SMS)
- [ ] Mobile app (React Native)
- [ ] Advanced betting integration
- [ ] Player performance predictions
- [ ] Machine learning model for predictions
- [ ] Advanced analytics dashboard
- [ ] Social features (sharing, comments)
- [ ] API rate limiting and caching optimization
- [ ] Community tournaments
