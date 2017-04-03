/**
 * Created by rohansapre on 4/1/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var calendarSchema = require('./calendar.schema.server');
var calendarModel = mongoose.model('Calendar', calendarSchema);

// api

calendarModel.getAvailability = getAvailability;
calendarModel.setAvailability = setAvailability;
calendarModel.updateAvailability = updateAvailability;
calendarModel.getInterviewerAvailability = getInterviewerAvailability;

module.exports = calendarModel;

function getAvailability(userId) {
    var d = q.defer();
    calendarModel.findOne({_user: userId}, function (err, calendar) {
        if(err)
            d.reject(err);
        else
            d.resolve(calendar);
    });
    return d.promise;
}

function setAvailability(userId, times) {
    var d = q.defer();
    var calendar = {
        _user: userId,
        startTime: times.start,
        endTime: times.end
    };
    calendarModel.create(calendar, function (err, calendar) {
        if(err)
            d.reject(err);
        else
            d.resolve(calendar);
    });
    return d.promise;
}

function updateAvailability(userId, times) {
    var d = q.defer();
    calendarModel.findOneAndUpdate({_user: userId}, {$set: {startTime: times.start, endTime: times.end}}, function (err, calendar) {
        if(err)
            d.reject(err);
        else
            d.resolve(calendar);
    });
    return d.promise;
}

function getInterviewerAvailability(interviewers) {
    var d = q.defer();
    calendarModel.find({_user: {$in: interviewers}}, function (err, calendar) {
        if(err)
            d.reject(err);
        else
            d.resolve(err);
    });
    return d.promise;
}