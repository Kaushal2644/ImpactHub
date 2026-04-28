process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION:', err);
});

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const connectDB = require('./config/db');

dotenv.config();
// connectDB();

const app = express();
// const passport = require('./config/passport');

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.set('trust proxy', 1);
// // Session middleware (required for passport)
// app.use(session({
//   secret: process.env.SESSION_SECRET || "fallback_secret",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,        // required for HTTPS (Cloud Run)
//     sameSite: "none"     // required for frontend on Firebase
//   }
// }));

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));
app.options('*', cors());

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

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

const startServer = async () => {
  try {
    await connectDB(); // wait for DB

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();