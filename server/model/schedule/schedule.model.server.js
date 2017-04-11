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

module.exports = scheduleModel;

function getUpcomingPositions(interviewerId) {
    return scheduleModel.find({_interviewer: interviewerId, start: {$gte: new Date()}})
        .distinct('_position')
        .populate('_position')
        .populate('_recruiter', 'firstName lastName')
        .exec();
}

function getPastPositions(interviewerId) {
    return scheduleModel.find({_interviewer: interviewerId, end: {$lt: new Date()}})
        .distinct('_position')
        .populate('_position')
        .populate('_recruiter', 'firstName lastName')
        .exec();
}

function getCandidatesForUpcomingPositions(interviewerId, positionId) {
    return scheduleModel.find({_interviewer: interviewerId, _position: positionId, start: {$gte: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec();
}

function getCandidatesForPastPositions(interviewerId, positionId) {
    return scheduleModel.find({_interviewer: interviewerId, _position: positionId, end: {$lt: new Date()}}, '_applicant')
        .populate('_applicant')
        .exec();
}

function updateInterviewTime(interviewId, time) {
    return scheduleModel.findByIdAndUpdate(interviewId, {$set: {start: time.start, end: time.end}});
}

function createInterview(hire) {
    return scheduleModel.create(hire);
}

function getUpcomingInterviewsForApplicant(userId) {
    return scheduleModel.find({_applicant: userId, start: {$gte: new Date()}})
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
    return scheduleModel.update({_id: interviewId}, {$set: {end: new Date()}});
}