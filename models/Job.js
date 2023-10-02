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
  posts: String,
  jobOpeningDate: String,
  jobClosingDate: String,
  jobId: String,
  aboutJob: String,
  seoUrl: String,
  createdBy: String,
}, {
  timestamps: {
    createdAt: 'created_At',
    updatedAt: 'updated_At',
  } 
});

module.exports = mongoose.model('Job', jobSchema);