/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var users = ['APPLICANT', 'INTERVIEWER', 'RECRUITER'];
var statuses = ['NONE', 'INVITED', 'JOINED', 'READY', 'WAITING', 'DONE'];
var userSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    type: { type: String, enum: users, default: users[0] },
    organization: String,
    status: { type: String, enum: statuses, default: statuses[0] },
    picture: String,
    resume: String,
    coverLetter: String,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'user'});

module.exports = userSchema;