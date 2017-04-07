/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var scheduleSchema = require('./schedule.schema.server');
var scheduleModel = mongoose.model('Schedule', scheduleSchema);

scheduleModel.getUpcomingPositions = getUpcomingPositions;
scheduleModel.getPastPositions = getPastPositions;
scheduleModel.getCandidatesForPosition = getCandidatesForPosition;
scheduleModel.updateInterviewTime = updateInterviewTime;

module.exports = scheduleModel;

function getUpcomingPositions(interviewerId) {
    var d = q.defer();
    scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
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

function getCandidatesForPosition(interviewerId, positionId) {
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