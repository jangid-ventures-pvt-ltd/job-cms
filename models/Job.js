const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  companyLogo: String,
  companyName: String,
  qualification: String,
  location: String,
  experience: String,
  salary: String,
  role: String,
  jobCategory: String,
  subCategories: [String], // Add subCategories field as an array of strings
  posts: String,
  jobOpeningDate: String, // Change to String
  jobClosingDate: String, // Change to String
  RefID: String, // Remove "required" validation
  aboutJob: String,
  seoUrl: String, // Change to String and remove "required" validation
  createdBy: String,
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('Job', jobSchema);
