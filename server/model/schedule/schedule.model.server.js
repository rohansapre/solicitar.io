/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var scheduleSchema = require('./schedule.schema.server');
var scheduleModel = mongoose.model('Schedule', scheduleSchema);

scheduleModel.scheduleInterview = scheduleInterview;

function scheduleInterview(userId, hire) {

}

module.exports = scheduleModel;