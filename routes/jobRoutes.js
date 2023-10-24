const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Import the Mongoose Job model
const checkAdmin = require('../middleware/checkRole')('admin');
const checkModerator = require('../middleware/checkRole')('moderator');

// Create a new job listing
router.post('/admin', checkAdmin, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/moderator', checkAdmin, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all job listings with optional category filter and sorted by freshness
router.get('/', async (req, res) => {
  try {
    let query = {}; // Default query object

    if (req.query.category) {
      query.jobCategory = req.query.category; // Filter by category if provided
    }

    const jobs = await Job.find(query).sort({ created_At: -1 }); // Sort by freshness in descending order
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//jobs with pagination
router.get('/paginate', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 9;

    let query = {}; // Default query object

    if (req.query.category) {
      query.jobCategory = req.query.category; // Filter by category if provided
    }

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / perPage);

    const jobs = await Job.find(query)
      .sort({ created_At: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      jobs,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get a specific job listing by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/moderator/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific job listing by seoUrl
router.get('/view/:seoUrl', async (req, res) => {
  try {
    const job = await Job.findOne({ seoUrl: req.params.seoUrl });
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific job listing by category
router.get('/all-jobs/:jobCategory', async (req, res) => {
  try {
    const job = await Job.findOne({ jobCategory: req.params.jobCategory });
    if (!job) {
      return res.status(404).json({ error: 'No Jobs Found' });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a job listing by ID
router.put('/admin/:id', checkAdmin, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/moderator/:id', checkModerator, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a job listing by ID
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndRemove(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.status(200).json(deletedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({});
    res.status(200).json({ totalJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;