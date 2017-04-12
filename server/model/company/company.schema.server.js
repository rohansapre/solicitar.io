/**
 * Created by rohansapre on 4/7/17.
 */
var mongoose = require('mongoose');
var companySchema = mongoose.Schema({
    _recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {collection: 'company'});

companySchema.post('remove', function () {
    var company = this;
    var scheduleModel = require('../schedule/schedule.model.server');
    var interviewModel = require('../interview/interview.model.server');
    var userModel = require('../user/user.model.server');
    // schedule, interview
    scheduleModel.find({_interviewer: company._interviewer}, '_id', function (err, schedules) {
        if(err === null) {
            interviewModel.remove({_schedule: {$in: schedules}});
            scheduleModel.remove({_id: {$in: schedules}});
        }
    });
    userModel.remove({_id: company._interviewer});
});

module.exports = companySchema;