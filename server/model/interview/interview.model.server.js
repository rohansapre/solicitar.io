/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var interviewSchema = require('./interview.schema.server');
var interviewModel = mongoose.model('Interview', interviewSchema);

interviewModel.createInterview = createInterview;
interviewModel.deleteInterview = deleteInterview;
interviewModel.getInterviewDetails = getInterviewDetails;

module.exports = interviewModel;

function createInterview(interview) {
    return interviewModel.create(interview);
}

function deleteInterview(interviewId) {
    return interviewModel.findByIdAndRemove(interviewId);
}

function getInterviewDetails(scheduleId) {
    return interviewModel.findOne({_schedule: scheduleId})
        .populate('_schedule')
        .exec();
}