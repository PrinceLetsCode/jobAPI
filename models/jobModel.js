const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter job title'],
        trim: true,
        maxLength: [100, 'Job title can not exceet 100 characters.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'please enter job description.'],
        maxlength: [1000, 'Job description can not exceed 1000 characters.']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add a valid email address.']

    },
    location: {
        type: {
            type: String,
            enum: [
                'Point',
            ]
        },
        coordinates: {
            type: [Number],
            index: '2dshpere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    address: {
        type: String,
        required: [true, 'Please add an address.']
    },
    company: {
        type: String,
        required: [true, 'Please add company name.']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Bussiness',
                'Information Technology',
                'Banking',
                'Eduaction/Training',
                "Marketing",
                'Telecommunication',
                'Others'
            ],
            message: 'Please select correct options for industry.'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: [
                'Permanent',
                'Temporary',
                'Internship'
            ],
            message: 'Please select correct job type.'
        }
    },

    minEducation: {
        type: String,
        required: true,
        enum: {
            values: [
                'Bachelors',
                'Masters',
                'PHD'
            ],
            message: 'Please select correct option for education.'
        }
    },

    positions: {
        type: Number,
        default: 1,
    },

    experience: {
        type: String,
        required: true,
        enum: {
            values: [
                'No Experience',
                '1 year - 2 years',
                '2 years - 5 years',
                '5 years+'
            ],
            message: 'Please select correct option for experience'
        }
    },

    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job.']
    },

    postingDate: {
        type: Date,
        default: Date.now
    },

    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 30)
    },

    applicantApplied: {
        type: [Object],
        select: false,
    },


});


//  creating job slug before saving.
jobSchema.pre('save', function (next) {
    // creating slug before saving to DB.
    this.slug = slugify(this.title, { lower: true });
    next();
})


// setting up location

jobSchema.pre('save', async function (next) {
    const loc = await geoCoder.geocode(this.address);
    console.log(loc);


    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

})

const Job = mongoose.model('Job', jobSchema);




module.exports = Job;