const express = require('express');
const router = express.Router();
const xmlbuilder = require('xmlbuilder');
const axios = require('axios');

// Define the URL for your backend API
const backendUrl = 'https://jobs-career-24-api.onrender.com';

// Create a route to generate and serve the sitemap
router.get('/sitemap.xml', async (req, res) => { // Define the sitemap.xml route
  try {
    // Fetch job data from the backend API
    const jobResponse = await axios.get(`${backendUrl}/api/jobs`);

    if (jobResponse.status !== 200) {
      throw new Error('Error fetching job data from the API');
    }

    const jobs = jobResponse.data;

    // Create the root element of the XML sitemap
    const root = xmlbuilder.create('urlset').att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    // Iterate through each job and create a URL entry
    jobs.forEach((job) => {
      const url = root.ele('url');
      url.ele('loc', `https://www.news4jobs.com/jobs/${job.seoUrl}`);
    });

    // Convert the XML to a string
    const sitemap = root.end({ pretty: true });

    // Set the response headers and send the sitemap
    res.header('Content-Type', 'application/xml'); // Set the Content-Type header
    res.send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
