/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var candidateSchema = require('./candidate.schema.server');
var candidateModel = mongoose.model('Candidate', candidateSchema);

candidateModel.getApplicants = getApplicants;
candidateModel.insertApplicants = insertApplicants;

module.exports = candidateModel;

function getApplicants(positionId) {
    var d = q.defer();
    candidateModel
        .find({_position: positionId})
        .populate('_applicant', 'email firstName lastName status')
        .exec(function (err, applicants) {
            if(err)
                d.reject(err);
            else
                d.resolve(applicants);
        });
    return d.promise;
}

function insertApplicants(positionId, users) {
    var d = q.defer();
    var candidates = [];
    for (var u in users) {
        candidates.push({
            _position: positionId,
            _applicant: users[u]
        })
    }
    candidateModel.insertMany(candidates, function (err, candidates) {
        if(err)
            d.reject(err);
        else
            d.resolve(candidates);
    })
}