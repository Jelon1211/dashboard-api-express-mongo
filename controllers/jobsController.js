const Candidate = require('../models/Candidate')
const Job = require('../models/Job')
// const bcrypt = require('bcrypt')

// @desc Get all jobs
// @route GET /jobs
// @access Private
const getAllJobs = async (req, res) => {
    // Get all jobs from MongoDB
    const jobs = await Job.find().select('-password').lean()

    // If no jobs 
    if (!jobs?.length) {
        return res.status(400).json({ message: 'No jobs found' })
    }

    res.json(jobs)
}

// @desc Create new job
// @route POST /jobs
// @access Private
const createNewJob = async (req, res) => {
    const { title, date, shortdescription, longdescription, logo } = req.body

    // Confirm data 
    if (!title || !date || !shortdescription || !longdescription || !logo) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name - it can duplicate
    // const duplicate = await Job.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate name' })
    // }

    // Hash password 
    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const jobObject = {title, date, shortdescription, longdescription, logo}

    // Create and store new job 
    const job = await Job.create(jobObject)

    if (job) { //created 
        res.status(201).json({ message: `New job ${title} created` })
    } else {
        res.status(400).json({ message: 'Invalid job data received' })
    }
}

// @desc Update a job
// @route PATCH /jobs
// @access Private
const updateJob = async (req, res) => {
    const { id, title, date, shortdescription, longdescription, logo} = req.body

    // Confirm data 
    if (!id || !title || !date || !shortdescription || !longdescription || !logo) {
        return res.status(400).json({ message: 'All fields are required to upade a job' })
    }

    // Does the job exist to update?
    const job = await Job.findById(id).exec()

    if (!job) {
        return res.status(400).json({ message: 'Job not found' })
    }

    // Check for duplicate - do not need here 
    // const duplicate = await Job.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original job 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate name' })
    // }

    job.title = title
    job.date = date
    job.shortdescription = shortdescription
    job.longdescription = longdescription
    job.logo = logo

    // if (password) {
    //     // Hash password 
    //     job.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

    const updatedJob = await job.save()

    res.json({ message: `${updatedJob.title} updated` })
}

// @desc Delete a job
// @route DELETE /jobs
// @access Private
const deleteJob = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Job ID Required' })
    }

    // Does the job still have assigned candidates?
    // const candidate = await Candidate.findOne({ job: id }).lean().exec()
    // if (candidate) {
    //     return res.status(400).json({ message: 'Job has assigned candidates' })
    // }

    // Does the job exist to delete?
    const job = await Job.findById(id).exec()

    if (!job) {
        return res.status(400).json({ message: 'Job not found' })
    }

    const result = await job.deleteOne()

    const reply = `Name ${result.title} with ID ${result._id} deleted`

    res.json(reply)
}

const singleJob = async (req, res) => {
    const job = await Job.findById(req.params.id)

    if(!job){
        return res.status(404).send("Job not found")
    }
    res.json(job)
}

module.exports = {
    getAllJobs,
    createNewJob,
    updateJob,
    deleteJob,
    singleJob
}