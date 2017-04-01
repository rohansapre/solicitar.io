/**
 * Created by rohansapre on 3/24/17.
 */
var mongoose = require('mongoose');
var positions = ['Software Developer', 'Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Android Developer', 'iOS Developer'];
var scheduleSchema = mongoose.Schema({
    _applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _interview: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _recruiter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    position: {type: String, enum: positions},
    date: {type: Date}
}, {collection: 'schedule'});

module.exports = scheduleSchema;