const Candidate = require('../models/Candidate')
const User = require('../models/User')

// @desc Get all candidates 
// @route GET /candidates
// @access Private
const getAllCandidates = async (req, res) => {
    // Get all candidates from MongoDB
    const candidates = await Candidate.find().lean()

    // If no candidates 
    if (!candidates?.length) {
        return res.status(400).json({ message: 'No candidates found' })
    }

    // Add username to each candidate before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    // Noice but leave it here for now
    // const candidatesWithUser = await Promise.all(candidates.map(async (candidate) => {
    //     const user = await User.findById(candidate.user).lean().exec()
    //     return { ...candidate, username: user.username }
    // }))

    res.json(candidates)
}

// @desc Create new candidate
// @route POST /candidates
// @access Private
const createNewCandidate = async (req, res) => {
    const { name, date, shortdescription, longdescription, logo } = req.body

    // Confirm data
    if (!name || !date || !shortdescription || !longdescription || !logo) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title - do not need now
    // const duplicate = await Candidate.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate candidate title' })
    // }

    // Create and store the new user 
    const candidate = await Candidate.create({ name, date, shortdescription, longdescription, logo })

    if (candidate) { // Created 
        return res.status(201).json({ message: 'New candidate created' })
    } else {
        return res.status(400).json({ message: 'Invalid candidate data received' })
    }

}

// @desc Update a candidate
// @route PATCH /candidates
// @access Private
const updateCandidate = async (req, res) => {
    const { id, name, date, shortdescription, longdescription, logo } = req.body

    // Confirm data
    if (!id || !name || !date || !shortdescription || !longdescription || !logo) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm candidate exists to update
    const candidate = await Candidate.findById(id).exec()

    if (!candidate) {
        return res.status(400).json({ message: 'Candidate not found' })
    }

    // Check for duplicate title - do not need now
    // const duplicate = await Candidate.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original candidate 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate candidate title' })
    // }

    candidate.name = name
    candidate.date = date
    candidate.shortdescription = shortdescription
    candidate.longdescription = longdescription
    candidate.logo = logo

    const updatedCandidate = await candidate.save()

    res.json(`'${updatedCandidate.name}' updated`)
}

// @desc Delete a candidate
// @route DELETE /candidates
// @access Private
const deleteCandidate = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Candidate ID required' })
    }

    // Confirm candidate exists to delete 
    const candidate = await Candidate.findById(id).exec()

    if (!candidate) {
        return res.status(400).json({ message: 'Candidate not found' })
    }

    const result = await candidate.deleteOne()

    const reply = `Candidate '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

const singleCandidate = async (req, res) => {
    const candidate = await Candidate.findById(req.params.id)

    if(!candidate){
        return res.status(404).send("Candidate not found")
    }
    res.json(candidate)
}

module.exports = {
    getAllCandidates,
    createNewCandidate,
    updateCandidate,
    deleteCandidate,
    singleCandidate
}