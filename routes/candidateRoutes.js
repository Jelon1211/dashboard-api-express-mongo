const express = require('express')
const router = express.Router()
const candidatesController = require('../controllers/candidatesController')

const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(candidatesController.getAllCandidates)
    .post(candidatesController.createNewCandidate)
    .patch(candidatesController.updateCandidate)
    .delete(candidatesController.deleteCandidate)

module.exports = router