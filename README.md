# Kodbank Application 🏦

A complete banking application with user registration, JWT authentication, and balance checking.

## ✅ Quick Start (3 Steps)

### Step 1: Install Dependencies
```cmd
cd kodbank\backend
npm install
```

### Step 2: Start Backend Server
```cmd
npm start
```
You should see: "Kodbank server running on port 3000" and "Database tables initialized successfully"

### Step 3: Open Application
Open `kodbank/START_HERE.html` in your browser, or directly open `kodbank/frontend/index.html`

## 🧪 Testing

### Automated Tests
Run the test script to verify all APIs:
```cmd
cd kodbank\backend
node test.js
```

### Manual Testing Flow
1. Open `START_HERE.html` in browser
2. Click "Test Backend APIs" to verify server
3. Click "Open Application"
4. Register a new user
5. Login with credentials
6. Click "Check Balance" to see your $100,000 balance with confetti animation!

## 📋 Features Implemented

✅ User Registration
- Fields: uid (auto-generated), username, email, password, phone, role
- Default role: customer
- Default balance: $100,000.00
- Password hashing with bcrypt

✅ User Login
- Username and password validation
- JWT token generation (username as subject, role as claim)
- Token stored in UserToken database table
- Token sent as cookie to client
- Automatic redirect to dashboard

✅ Balance Check
- JWT token verification
- Extract username from token
- Fetch balance from database
- Display with confetti animation

## 🗄️ Database Schema

### KodUser Table
- uid (VARCHAR 36, PRIMARY KEY) - Auto-generated UUID
- username (VARCHAR 50, UNIQUE) - User's login name
- email (VARCHAR 100, UNIQUE) - User's email
- password (VARCHAR 255) - Hashed password
- balance (DECIMAL 15,2) - Account balance (default: 100000.00)
- phone (VARCHAR 20) - Phone number
- role (ENUM) - customer/manager/admin (default: customer)

### UserToken Table
- tid (INT, AUTO_INCREMENT, PRIMARY KEY) - Token ID
- token (TEXT) - JWT token string
- uid (VARCHAR 36, FOREIGN KEY) - References KodUser.uid
- expairy (DATETIME) - Token expiration time

## 🔌 API Endpoints

### POST /api/register
Register a new user
```json
Request:
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}

Response:
{
  "success": true,
  "message": "Registration successful"
}
```

### POST /api/login
Login and receive JWT token
```json
Request:
{
  "username": "john",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/balance
Get user balance (requires JWT token)
```json
Headers:
Authorization: Bearer <token>

Response:
{
  "balance": "100000.00"
}
```

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- MySQL (Aiven Cloud)
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- HTML5
- CSS3 (with gradient backgrounds)
- Vanilla JavaScript
- Confetti animation

## 📁 Project Structure
```
kodbank/
├── backend/
│   ├── server.js       # Main Express server
│   ├── db.js          # Database connection & initialization
│   ├── package.json   # Dependencies
│   ├── .env          # Database credentials
│   └── test.js       # API test suite
├── frontend/
│   ├── index.html     # Landing page
│   ├── register.html  # Registration form
│   ├── login.html     # Login form
│   ├── dashboard.html # User dashboard
│   └── styles.css     # Shared styles
├── START_HERE.html    # Quick start page
└── README.md         # This file
```

## 🐛 Troubleshooting

**Server won't start:**
- Make sure port 3000 is not in use
- Check database credentials in `.env` file
- Run `npm install` again

**Database connection error:**
- Verify internet connection (using Aiven cloud database)
- Check if database credentials are correct
- SSL certificate issue is handled with `rejectUnauthorized: false`

**Frontend not connecting:**
- Ensure backend server is running on port 3000
- Check browser console for CORS errors
- Try opening in different browser

## 🎯 Test Results

All tests passing:
✅ Registration - Creates user with default balance
✅ Login - Generates and stores JWT token
✅ Balance Check - Verifies token and returns balance

## 🔐 Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 24 hours
- Tokens stored in database for tracking
- CORS enabled for local development
- SSL connection to database (certificate validation disabled for development)

## 📝 Environment Variables

Located in `backend/.env`:
```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=3000
```

⚠️ **Important:** 
- Copy `.env.example` to `.env` and fill in your actual database credentials
- Never commit the actual `.env` file to GitHub
- Change JWT_SECRET in production!
