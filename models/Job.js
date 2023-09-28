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
  posts: Number,
  jobOpeningDate: Date,
  jobClosingDate: Date,
  aboutJob: String,
  seoUrl: String,
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('Job', jobSchema);