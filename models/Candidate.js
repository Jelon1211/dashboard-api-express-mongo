const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const candidateSchema = new mongoose.Schema(
    {
        name: {
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
}, 
{
    timestams: true
}
);

candidateSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Candidate', candidateSchema)