/**
 * Created by rohansapre on 4/4/17.
 */
var mongoose = require('mongoose');
var positionSchema = mongoose.Schema({
    _recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    location: String,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'position'});

positionSchema.post('remove', function () {
    var position = this;
    // schedule, interview, candidate
    var calendarModel = require('../calendar/calendar.model.server');
    var candidateModel = require('../candidate/candidate.model.server');
    var scheduleModel = require('../schedule/schedule.model.server');
    var interviewModel = require('../interview/interview.model.server');
    calendarModel.remove({_position: position._id});
    candidateModel.remove({_position: position._id});
    scheduleModel.find({_position: position._id}, '_id', function (err, schedules) {
        if(err === null) {
            interviewModel.remove({_schedule: {$in: schedules}});
            scheduleModel.remove({_id: {$in: schedules}});
        }
    });
});

module.exports = positionSchema;