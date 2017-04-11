/**
 * Created by rohansapre on 4/2/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var interviewSchema = require('./interview.schema.server');
var interviewModel = mongoose.model('Interview', interviewSchema);

module.exports = interviewModel;