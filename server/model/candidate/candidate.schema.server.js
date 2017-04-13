/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var candidateSchema = mongoose.Schema({
    _position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position'},
    _applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'candidate'});

candidateSchema.post('remove', function () {
    var candidate = this;
    var scheduleModel = require('../schedule/schedule.model.server');
    var interviewModel = require('../interview/interview.model.server');
    scheduleModel.findOne({_applicant: candidate._applicant, _position: candidate._position}, '_id', function (err, schedule) {
        if(err === null && schedule !== null) {
            interviewModel.remove({_schedule: schedule._id});
            schedule.remove();
        }
    })
});

module.exports = candidateSchema;