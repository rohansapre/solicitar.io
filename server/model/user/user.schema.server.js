/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var users = ['APPLICANT', 'INTERVIEWER', 'RECRUITER'];
var userSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    type: { type: String, enum: users },
    picture: String,
    resume: String,
    coverLetter: String,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'user'});

module.exports = userSchema;