const User = require('../models/User')
const Note = require('../models/Note')
const Job = require('../models/Job')
const bcrypt = require('bcrypt')

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
    const { name } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await Job.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // // Hash password 
    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // const jobObject = (!Array.isArray(roles) || !roles.length)
    //     ? { name, "password": hashedPwd }
    //     : { name, "password": hashedPwd, roles }

    // Create and store new job 
    const job = await Job.create(jobObject)

    if (job) { //created 
        res.status(201).json({ message: `New job ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid job data received' })
    }
}

// @desc Update a job
// @route PATCH /jobs
// @access Private
const updateJob = async (req, res) => {
    const { id, jobname, roles, active, password } = req.body

    // Confirm data 
    if (!id || !jobname || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the job exist to update?
    const job = await Job.findById(id).exec()

    if (!job) {
        return res.status(400).json({ message: 'Job not found' })
    }

    // Check for duplicate 
    const duplicate = await Job.findOne({ jobname }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original job 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate jobname' })
    }

    job.jobname = jobname
    job.roles = roles
    job.active = active

    if (password) {
        // Hash password 
        job.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedJob = await job.save()

    res.json({ message: `${updatedJob.jobname} updated` })
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

    // Does the job still have assigned notes?
    const note = await Note.findOne({ job: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Job has assigned notes' })
    }

    // Does the job exist to delete?
    const job = await Job.findById(id).exec()

    if (!job) {
        return res.status(400).json({ message: 'Job not found' })
    }

    const result = await job.deleteOne()

    const reply = `Jobname ${result.jobname} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllJobs,
    createNewJob,
    updateJob,
    deleteJob
}