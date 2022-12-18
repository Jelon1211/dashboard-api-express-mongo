const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    shortdescription: {
        type: String,
        required: true,
    },
    longdescription: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Job', jobSchema)