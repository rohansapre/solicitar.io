/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var scheduleSchema = require('./schedule.schema.server');
var scheduleModel = mongoose.model('Schedule', scheduleSchema);

scheduleModel.scheduleInterview = scheduleInterview;
scheduleModel.getPositions = getPositions;

function scheduleInterview(userId, hire) {

}

function getPositions(interviewerId) {
    var d = q.defer();
    scheduleModel
        .find({_interviewer: interviewerId, date: {$gte: new Date()}})
        .distinct('_position')
        .populate('_position')
        .exec(function (err, positions) {
            if(err)
                d.reject(err);
            else
                d.resolve(positions);
        });
    return d.promise;
}

module.exports = scheduleModel;