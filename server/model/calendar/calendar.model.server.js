/**
 * Created by rohansapre on 4/1/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var calendarSchema = require('./calendar.schema.server');
var calendarModel = mongoose.model('Calendar', calendarSchema);

// api

calendarModel.getAvailability = getAvailability;
calendarModel.setAvailability = setAvailability;
calendarModel.updateAvailability = updateAvailability;
calendarModel.getInterviewerAvailability = getInterviewerAvailability;

module.exports = calendarModel;

function getAvailability(userId) {
    return calendarModel.findOne({_user: userId});
}

function setAvailability(userId, times) {
    var calendar = {
        _user: userId,
        startTime: times.start,
        endTime: times.end
    };
    return calendarModel.create(calendar);
}

function updateAvailability(userId, times) {
    return calendarModel.findOneAndUpdate({_user: userId}, {$set: {startTime: times.start, endTime: times.end}});
}

function getInterviewerAvailability(interviewers) {
    return calendarModel.find({_user: {$in: interviewers}});
}