/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
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
scheduleModel.getNextInterviewForInterviewer = getNextInterviewForInterviewer;
scheduleModel.getNextInterviewForApplicant = getNextInterviewForApplicant;
scheduleModel.endInterview = endInterview;
scheduleModel.getInterviewsForPosition = getInterviewsForPosition;
scheduleModel.deleteSchedule = deleteSchedule;
scheduleModel.getScheduledInterviews = getScheduledInterviews;
scheduleModel.getUpcomingPositionsByIds = getUpcomingPositionsByIds;
scheduleModel.getPastPositionsByIds = getPastPositionsByIds;

module.exports = scheduleModel;

function getUpcomingPositions(interviewerId) {
    return scheduleModel.find({$and: [{_interviewer: interviewerId}, {$or: [ {start: {$exists: false}}, {start: {$gte: new Date()}} ]}]})
        .distinct('_position')
        .exec();
}

function getPastPositions(interviewerId) {
    console.log("past positions in db");
    console.log(interviewerId);
    return scheduleModel.find({_interviewer: interviewerId, end: {$lt: new Date()}})
        .distinct('_position')
        .exec();
}

function getCandidatesForUpcomingPositions(interviewerId, positionId) {
    return scheduleModel.find({$and: [{_interviewer: interviewerId}, {_position: positionId}, {$or: [ {start: {$exists: false}}, {start: {$gte: new Date()}} ]}]})
    // return scheduleModel.find({_interviewer: interviewerId, _position: positionId, start: {$gte: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec();
}

function getCandidatesForPastPositions(interviewerId, positionId) {
    return scheduleModel.find({_interviewer: interviewerId, _position: positionId, end: {$lt: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec();
}

function updateInterviewTime(interviewId, time) {
    console.log("in db");
    console.log(time);
    return scheduleModel.updateOne({_id: interviewId}, {$set: {start: time.start, end: time.end}});
}

function createInterview(hire) {
    return scheduleModel.create(hire);
}

function getUpcomingInterviewsForApplicant(userId) {
    console.log(userId);
    return scheduleModel.find({$and: [{_applicant: userId}, {$or: [ {start: {$exists: false}}, {start: {$gte: new Date()}} ]}]})
        .populate('_interviewer', 'firstName lastName')
        .populate('_position')
        .exec();
}

function getPastInterviewsForApplicant(userId) {
    return scheduleModel.find({_applicant: userId, end: {$lt: new Date()}})
        .populate('_position')
        .exec();
}

function getInterviewerSchedule(interviewerId) {
    return scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
        .populate('_applicant', 'firstName lastName')
        .populate('_position')
        .sort('start')
        .exec();
}

function getNextInterviewForInterviewer(interviewerId) {
    return scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
        .populate('_applicant', 'firstName lastName')
        .populate('_position')
        .sort('start')
        .limit(1)
        .exec();
}

function getNextInterviewForApplicant(applicantId) {
    return scheduleModel.find({_applicant: applicantId, start: {$gte: new Date()}})
        .populate('_interviewer', 'firstName lastName')
        .populate('_position')
        .sort('start')
        .limit(1)
        .exec();
}

function endInterview(interviewId) {
    console.log("updating db end interview");
    console.log(interviewId);
    return scheduleModel.update({_id: interviewId}, {$set: {end: new Date()}});
}

function getInterviewsForPosition(positionId, applicants) {
    return scheduleModel.find({_position: positionId, _applicant: {$in: applicants}});
}

function deleteSchedule(scheduleId) {
    var d = q.defer();
    scheduleModel.findByIdAndRemove(scheduleId, function (err, schedule) {
        if(err)
            d.reject(err);
        else {
            schedule.remove();
            d.resolve(schedule);
        }
    });
    return d.promise;
}

function getScheduledInterviews(positionId) {
    return scheduleModel.find({_position: positionId})
        .populate('_interviewer', 'firstName lastName');
}

function getPastPositionsByIds(interviewerId, positions) {
    return scheduleModel.find({_interviewer: interviewerId, end: {$lt: new Date()}, _position: {$in: positions}})
        .populate('_position')
        .exec();
}

function getUpcomingPositionsByIds(interviewerId, positions) {
    return scheduleModel.find({$and: [{_interviewer: interviewerId}, {_position: {$in: positions}}, {$or: [ {start: {$exists: false}}, {start: {$gte: new Date()}} ]}]})
        .populate('_position')
        .exec();
}