const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const passport = require('./config/passport');

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://impact-hub-roan.vercel.app/login', process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/needs', require('./routes/needs'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/match', require('./routes/match'));
app.use('/api/ai', require('./routes/ai'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ImpactHub API is running!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});