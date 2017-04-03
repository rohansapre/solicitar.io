/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var candidateSchema = mongoose.Schema({
    _recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {collection: 'candidate'});

module.exports = candidateSchema;