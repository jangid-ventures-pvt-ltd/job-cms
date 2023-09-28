const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  about: String,
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('Category', categorySchema);
