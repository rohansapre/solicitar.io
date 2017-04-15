/**
 * Created by rohansapre on 3/24/17.
 */
var mongoose = require('mongoose');
var prog_languages = ['Python', 'Java', 'C++'];
var interviewSchema = mongoose.Schema({
    _schedule: {type: mongoose.Schema.Types.ObjectId, ref: 'Schedule'},
    firebase: String,
    twilioRoom: String,
    language: {type: String, enum: prog_languages, default: prog_languages[0]},
    studentFeedback: String,
    recruiterFeedback: String,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'interview'});

module.exports = interviewSchema;