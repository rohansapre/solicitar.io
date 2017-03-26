/**
 * Created by rohansapre on 3/24/17.
 */
var mongoose = require('mongoose');
var statuses = ['INVITED', 'JOINED', 'READY', 'WAITING', 'DONE'];
var scheduleSchema = mongoose.Schema({
    _applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _interview: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _recruiter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date},
    status: {type: String, enum: statuses}
}, {collection: 'schedule'});

module.exports = scheduleSchema;