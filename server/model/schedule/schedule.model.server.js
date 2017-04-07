/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var scheduleSchema = require('./schedule.schema.server');
var scheduleModel = mongoose.model('Schedule', scheduleSchema);

scheduleModel.getUpcomingPositions = getUpcomingPositions;
scheduleModel.getPastPositions = getPastPositions;
scheduleModel.getCandidatesForUpcomingPositions = getCandidatesForUpcomingPositions;
scheduleModel.getCandidatesForPastPositions = getCandidatesForPastPositions;
scheduleModel.updateInterviewTime = updateInterviewTime;
scheduleModel.createInterview = createInterview;
scheduleModel.getUpcomingInterviewsForApplicant = getUpcomingInterviewsForApplicant;
scheduleModel.getPastInterviewsForApplicant = getPastInterviewsForApplicant;
scheduleModel.getInterviewerSchedule = getInterviewerSchedule;

module.exports = scheduleModel;

function getUpcomingPositions(interviewerId) {
    var d = q.defer();
    console.log("positions in db");
    scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
        .distinct('_position')
        .populate('_position')
        .populate('_recruiter', 'firstName lastName')
        .exec(function (err, positions) {
            if(err)
                d.reject(err);
            else {
                console.log("positions resolved");
                console.log(positions);
                d.resolve(positions);
            }
        });
    return d.promise;
}

function getPastPositions(interviewerId) {
    var d = q.defer();
    scheduleModel.find({_interviewer: interviewerId, end: {$lt: new Date()}})
        .distinct('_position')
        .populate('_position')
        .populate('_recruiter', 'firstName lastName')
        .exec(function (err, positions) {
            if(err)
                d.reject(err);
            else
                d.resolve(positions);
        });
    return d.promise;
}

function getCandidatesForUpcomingPositions(interviewerId, positionId) {
    var d = q.defer();
    scheduleModel.find({_interviewer: interviewerId, _position: positionId, start: {$gte: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec(function (err, candidates) {
            if(err)
                d.reject(err);
            else
                d.resolve(candidates);
        });
    return d.promise;
}

function getCandidatesForPastPositions(interviewerId, positionId) {
    var d = q.defer();
    scheduleModel.find({_interviewer: interviewerId, _position: positionId, end: {$lt: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec(function (err, candidates) {
            if(err)
                d.reject(err);
            else
                d.resolve(candidates);
        });
    return d.promise;
}

function updateInterviewTime(interviewId, time) {
    var d = q.defer();
    scheduleModel.findByIdAndUpdate(interviewId, {$set: {start: time.start, end: time.end}}, function (err, interview) {
        if(err)
            d.reject(err);
        else
            d.resolve(interview);
    });
    return d.promise;
}

function createInterview(hire) {
    var d = q.defer();
    scheduleModel.create(hire, function (err, interview) {
        if(err)
            d.reject(err);
        else
            d.resolve(interview);
    });
    return d.promise;
}

function getUpcomingInterviewsForApplicant(userId) {
    var d = q.defer();
    scheduleModel.find({_applicant: userId, start: {$gte: new Date()}})
        .populate('_position')
        .exec(function (err, interviews) {
            if(err)
                d.reject(err);
            else
                d.resolve(interviews);
        });
    return d.promise;
}

function getPastInterviewsForApplicant(userId) {
    var d = q.defer();
    scheduleModel.find({_applicant: userId, end: {$lt: new Date()}})
        .populate('_position')
        .exec(function (err, interviews) {
            if(err)
                d.reject(err);
            else
                d.resolve(interviews);
        });
    return d.promise;
}

function getInterviewerSchedule(interviewerId) {
    var d = q.defer();
    scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
        .populate('_applicant', 'firstName lastName')
        .populate('_position')
        .sort('start')
        .exec(function (err, interviews) {
            if(err)
                d.reject(err);
            else
                d.resolve(interviews);
        });
    return d.promise;
}