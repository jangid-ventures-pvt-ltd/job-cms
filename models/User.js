// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // 'admin' or 'moderator'
  token: String
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('User', userSchema);