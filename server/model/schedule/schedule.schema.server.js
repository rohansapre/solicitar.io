/**
 * Created by rohansapre on 3/24/17.
*/
var mongoose = require('mongoose');
var scheduleSchema = mongoose.Schema({
    _applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _interviewer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _recruiter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position'},
    date: {type: Date}
}, {collection: 'schedule'});

module.exports = scheduleSchema;