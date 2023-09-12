const Job = require("../models/jobModel");
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require("..//utils/errorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');





const getJobs = async (req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
};

const newJob = catchAsyncErrors( async (req, res, next) => {
    console.log(req.body);
    const job = await Job.create(req.body);
    res.status(200).json({
        success: true,
        message: "Job created",
        data: job
    });
});


// Search jobs within radius => /api/v1/jobs/:zipcode/:distance

const getJobsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Getting latitude and longitude from geocoder with zipcode.
    const loc = await geoCoder.geocode(zipcode);

    console.log(loc);

    const latitude = loc[0].latitude; // Fix the typo here (from latidute to latitude)
    const longitude = loc[0].longitude;

    const radius = parseFloat(distance) / 3963; // Parse distance as a number

    const jobs = await Job.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius],
            },
        },
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs,
    });
};


// Update a job => /api/v1/job/:id

const updateJob = async (req, res, next) => {



    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler(404,'Job not found.'));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: 'Job is updated',
        data: job
    })

}


// delete a job

const deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found.'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Job is deleted.'
    })
}


// get a single job with id and slug. => /api/v1/job/:id/:slug


const getJob = async (req, res, next) => {
    let job = await Job.find(
        {
            $and:
                [
                    { _id: req.params.id },
                    { slug: req.params.slug }
                ]
        }
    );

    if (!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Job not found.'
        })
    }

    job = await res.status(200).json({
        success: true,
        data: job

    })
}


// Get stats about a topic ( job ) => /api/v1/stats/:topic


const jobStats = async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: { $text: { $search: "\"" + req.params.topic + "\"" } }
        },
        {
            $group: {
                _id: { $toUpper: '$experience' },
                totalJobs: { $sum: 1 },
                avgPositions: { $avg: '$positions' },
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' }
            }
        }
    ]);

    if (stats.length === 0) {
        return res.status(200).json({
            success: false,
            message: `No stats found for - ${req.params.topic}`
        })
    }


    res.status(200).json({
        success: true,
        data: stats
    })
}



module.exports = {
    getJobs,
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getJob,
    jobStats
};
