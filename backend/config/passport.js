const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update last login
          user.lastLogin = Date.now();
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // Check if email already registered with local auth
        user = await User.findOne({
          email: profile.emails[0].value
        });

        if (user) {
          // Link google account to existing user
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.avatar = profile.photos[0]?.value || null;
          user.lastLogin = Date.now();
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // Create new user from Google profile
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value || null,
          authProvider: 'google',
          role: 'volunteer',
          lastLogin: Date.now()
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;