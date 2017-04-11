/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var users = ['APPLICANT', 'INTERVIEWER', 'RECRUITER'];
var statuses = ['NONE', 'INVITED', 'JOINED', 'READY', 'WAITING', 'DONE'];
var userSchema = mongoose.Schema({
    username: { type: String, index: { unique: true } },
    password: String,
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    type: { type: String, enum: users, default: users[0] },
    organization: String,
    status: { type: String, enum: statuses, default: statuses[0] },
    picture: String,
    resume: String,
    coverLetter: String,
    facebook: { id: String, token: String },
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'user'});

userSchema.post('remove', function () {
    var user = this;
    var calendarModel = require('../calendar/calendar.model.server');
    var candidateModel = require('../candidate/candidate.model.server');
    var scheduleModel = require('../schedule/schedule.model.server');
    var interviewModel = require('../interview/interview.model.server');
    calendarModel.remove({_user: user._id});
    candidateModel.remove({_applicant: user._id});
    scheduleModel.find({_applicant: user._id}, '_id', function (err, schedules) {
        if(err === null) {
            interviewModel.remove({_schedule: {$in: schedules}});
            scheduleModel.remove({_id: {$in: schedules}});
        }
    });
});

module.exports = userSchema;