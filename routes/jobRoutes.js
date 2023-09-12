const express = require('express');
const router = express.Router();

const { 
    getJobs,
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getJob,
    jobStats
} = require('../controllers/jobController');

router.route('/jobs').get(getJobs);
router.route('/job/:id/:slug').get(getJob);
router.route('/jobs/new').post(newJob);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
router.route('/job/:id').put(updateJob).delete(deleteJob);
router.route('/stats/:topic').get(jobStats);



module.exports = router;