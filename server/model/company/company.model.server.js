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

module.exports = companyModel;