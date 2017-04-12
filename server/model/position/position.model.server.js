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
    var d = q.defer();
    positionModel.findByIdAndRemove(positionId, function (err, position) {
        if(err)
            d.reject(err);
        else {
            position.remove();
            d.resolve(position);
        }
    });
    return d.promise;
}