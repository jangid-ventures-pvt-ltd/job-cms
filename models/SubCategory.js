const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: String,
  about: String,
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
