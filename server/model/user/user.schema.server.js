/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var users = ['APPLICANT', 'INTERVIEWER', 'RECRUITER', 'ADMIN'];
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
    picture: {type: String, default: "http://placehold.it/800x200"},
    resume: String,
    coverLetter: String,
    facebook: { id: String, token: String },
    google: { id: String, token: String },
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'user'});

userSchema.post('remove', function () {
    var user = this;
    var calendarModel = require('../calendar/calendar.model.server');
    var candidateModel = require('../candidate/candidate.model.server');
    var scheduleModel = require('../schedule/schedule.model.server');
    var interviewModel = require('../interview/interview.model.server');
    var positionModel = require('../position/position.model.server');
    var companyModel = require('../company/company.model.server');
    var userModel = require('../user/user.model.server');
    if (user.type === 'APPLICANT') {
        calendarModel.remove({_user: user._id});
        candidateModel.remove({_applicant: user._id});
        scheduleModel.find({_applicant: user._id}, '_id', function (err, schedules) {
            if(err === null) {
                interviewModel.remove({_schedule: {$in: schedules}});
                scheduleModel.remove({_id: {$in: schedules}});
            }
        });
    } else if (user.type === 'RECRUITER') {
        // schedule, position, interview, company, candidate
        positionModel.find({_recruiter: user._id}, '_id', function (err, positions) {
            if(err === null) {
                scheduleModel.find({_position: {$in: positions}}, '_id', function (err, schedules) {
                    if(err === null) {
                        interviewModel.remove({_schedule: {$in: schedules}});
                        scheduleModel.remove({_id: {$in: schedules}});
                    }
                });
                candidateModel.remove({_position: {$in: positions}});
                positionModel.remove({_id: {$in: positions}});
            }
        });
        companyModel.find({_recruiter: user._id}, '_interviewer', function (err, companies) {
            if(err === null) {
                // remove interviewer dependencies
                userModel.find({_id: companies}, '_id', function (err, users) {
                    if(err === null) {
                        scheduleModel.find({_interviewer: users}, '_id', function (err, schedules) {
                            if(err === null) {
                                interviewModel.remove({_schedule: {$in: schedules}});
                                scheduleModel.remove({_id: {$in: schedules}});
                            }
                        });
                        userModel.remove({_id: {$in: users}});
                    }
                });
                companyModel.remove({_id: companies});
            }
        })
    } else if (user.type === 'INTERVIEWER') {
        // schedule, interview, company
        scheduleModel.find({_interviewer: user._id}, '_id', function (err, schedules) {
            if(err === null) {
                interviewModel.remove({_schedule: {$in: schedules}});
                scheduleModel.remove({_id: {$in: schedules}});
            }
        });
        companyModel.remove({_interviewer: user._id});
    }
});

module.exports = userSchema;