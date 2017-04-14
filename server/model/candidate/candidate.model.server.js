/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var candidateSchema = require('./candidate.schema.server');
var candidateModel = mongoose.model('Candidate', candidateSchema);

candidateModel.getApplicants = getApplicants;
candidateModel.insertApplicants = insertApplicants;
candidateModel.deleteCandidate = deleteCandidate;

module.exports = candidateModel;

function getApplicants(positionId) {
    return candidateModel
        .find({_position: positionId})
        .populate('_applicant', 'email firstName lastName status')
        .populate('_position', '_recruiter')
        .sort('-dateCreated')
        .exec();
}

function insertApplicants(positionId, users) {
    var candidates = [];
    for (var u in users) {
        candidates.push({
            _position: positionId,
            _applicant: users[u]
        })
    }
    return candidateModel.insertMany(candidates);
}

function deleteCandidate(candidateId) {
    var d = q.defer();
    candidateModel.findByIdAndRemove(candidateId, function (err, candidate) {
        if(err)
            d.reject(err);
        else {
            candidate.remove();
            d.resolve(candidate);
        }
    });
    return d.promise;
}