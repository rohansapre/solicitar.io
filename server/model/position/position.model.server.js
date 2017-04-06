/**
 * Created by rohansapre on 4/5/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var positionSchema = require('./position.schema.server');
var positionModel = mongoose.model('Position', positionSchema);

positionModel.createPosition = createPosition;
positionModel.getPositions = getPositions;
positionModel.deletePosition = deletePosition;

function createPosition(position) {
    var d = q.defer();
    positionModel.create(position, function (err, position) {
        if(err)
            d.reject(err);
        else
            d.resolve(position);
    });
    return d.promise;
}

function getPositions(recruiterId) {
    var d = q.defer();
    positionModel.find({_recruiter: recruiterId}, function (err, positions) {
        console.log(err);
        if(err)
            d.reject(err);
        else
            d.resolve(positions);
    });
    return d.promise;
}

function deletePosition(positionId) {
    var d = q.defer();
    positionModel.findByIdAndRemove(positionId, function (err, position) {
        if(err)
            d.reject(err);
        else
            d.resolve(position);
    })
    return d.promise;
}

module.exports = positionModel;