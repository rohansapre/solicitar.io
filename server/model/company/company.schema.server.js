/**
 * Created by rohansapre on 4/7/17.
 */
var mongoose = require('mongoose');
var companySchema = mongoose.Schema({
    _recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {collection: 'company'});

module.exports = companySchema;