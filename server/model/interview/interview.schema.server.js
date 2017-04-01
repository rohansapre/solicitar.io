/**
 * Created by rohansapre on 3/24/17.
 */
var mongoose = require('mongoose');
var interviewSchema = mongoose.Schema({
    _schedule: {type: mongoose.Schema.Types.ObjectId, ref: 'Schedule'},
    _firebase: {type: mongoose.Schema.Types.ObjectId, ref: 'Firebase'},
    twilioRoom: String,
    studentFeedback: String,
    recruiterFeedback: String
}, {collection: 'interview'});

module.exports = interviewSchema;