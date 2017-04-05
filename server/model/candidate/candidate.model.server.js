/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var candidateSchema = require('./candidate.schema.server');
var candidateModel = mongoose.model('Candidate', candidateSchema);

candidateModel.getApplicantsForRecruiter = getApplicantsForRecruiter;

module.exports = candidateModel;

function getApplicantsForRecruiter(recruiterId) {
    var d = q.defer();
    candidateModel
        .find({_recruiter: recruiterId})
        .populate('_applicant', 'email firstName lastName organization status')
        .exec(function (err, applicants) {
            if(err)
                d.reject(err);
            else
                d.resolve(applicants);
        });
    return d.promise;
}