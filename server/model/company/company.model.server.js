/**
 * Created by rohansapre on 4/7/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var companySchema = require('./company.schema.server');
var companyModel = mongoose.model('Company', companySchema);

companyModel.createCompany = createCompany;
companyModel.getInterviewers = getInterviewers;
companyModel.deleteInterviewer = deleteInterviewer;
companyModel.deleteCompany = deleteCompany;

module.exports = companyModel;

function createCompany(company) {
    return companyModel.create(company);
}

function getInterviewers(recruiterId) {
    return companyModel.find({_recruiter: recruiterId})
        .populate('_interviewer')
        .exec();
}

function deleteInterviewer(interviewerId) {
    return companyModel.remove({_interviewer: interviewerId});
}

function deleteCompany(companyId) {
    var d = q.defer();
    companyModel.findByIdAndRemove(companyId, function (err, company) {
        if(err)
            d.reject(err);
        else {
            company.remove();
            d.resolve(company);
        }
    });
    return d.promise;
}