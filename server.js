const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors'); // Import the cors middleware
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import the User model

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport.js Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect credentials' });
      }

      return done(null, user); // Store user in req.user
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/userRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
