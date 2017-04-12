/**
 * Created by rohansapre on 3/24/17.
*/
var mongoose = require('mongoose');
var scheduleSchema = mongoose.Schema({
    _applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _interviewer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position'},
    start: {type: Date},
    end: {type: Date},
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'schedule'});

scheduleSchema.post('remove', function () {
    var schedule = this;
    var interviewModel = require('../interview/interview.model.server');
    interviewModel.remove({_schedule: schedule._id});
});

module.exports = scheduleSchema;