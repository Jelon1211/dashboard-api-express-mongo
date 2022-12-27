const express = require('express')
const router = express.Router()
const jobsController = require('../controllers/jobsController')

const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(jobsController.getAllJobs)
    .post(jobsController.createNewJob)
    .patch(jobsController.updateJob)
    .delete(jobsController.deleteJob)

router.get('/:id', jobsController.singleJob);

module.exports = router