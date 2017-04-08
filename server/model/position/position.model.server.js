/**
 * Created by rohansapre on 4/5/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var positionSchema = require('./position.schema.server');
var positionModel = mongoose.model('Position', positionSchema);

positionModel.createPosition = createPosition;
positionModel.getPositions = getPositions;
positionModel.deletePosition = deletePosition;

module.exports = positionModel;

function createPosition(position) {
    return positionModel.create(position);
}

function getPositions(recruiterId) {
    return positionModel.find({_recruiter: recruiterId});
}

function deletePosition(positionId) {
    return positionModel.findByIdAndRemove(positionId);
}