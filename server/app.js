/**
 * Created by rohansapre on 3/21/17.
 */
module.exports = function (app) {
    var bcrypt = require('bcrypt-nodejs');
    var password = bcrypt.hashSync('pass');
    var admin = {
        username: 'admin',
        password: bcrypt.hashSync('admin'),
        type: 'ADMIN'
    };
    var applicant1 = {
        username: 'rohan1',
        password: password,
        email: 'rohan1@yahoo.com',
        firstName: 'Rohan1',
        lastName: 'Sapre',
        type: 'APPLICANT',
        organization: 'Northeastern University'
    };
    var applicant2 = {
        username: 'rohan2',
        password: password,
        email: 'rohan2@yahoo.com',
        firstName: 'Rohan2',
        lastName: 'Sapre',
        type: 'APPLICANT',
        organization: 'Arizona State University'
    };
    var applicant3 = {
        username: 'rohan3',
        password: password,
        email: 'rohan3@yahoo.com',
        firstName: 'Rohan3',
        lastName: 'Sapre',
        type: 'APPLICANT',
        organization: 'University of Buffalo'
    };
    var recruiter1 = {
        username: 'tushar1',
        password: password,
        email: 'tushar1@yahoo.com',
        firstName: 'Tushar1',
        lastName: 'Gupta',
        type: 'RECRUITER',
        organization: 'Tesla'
    };
    var recruiter2 = {
        username: 'tushar2',
        password: password,
        email: 'tushar2@yahoo.com',
        firstName: 'Tushar2',
        lastName: 'Gupta',
        type: 'RECRUITER',
        organization: 'SpaceX'
    };
    var interviewer1 = {
        username: 'amul1',
        password: password,
        email: 'amul1@yahoo.com',
        firstName: 'Amul1',
        lastName: 'Mehta',
        type: 'INTERVIEWER',
        organization: 'Tesla'
    };
    var interviewer2 = {
        username: 'amul2',
        password: password,
        email: 'amul2@yahoo.com',
        firstName: 'Amul2',
        lastName: 'Mehta',
        type: 'INTERVIEWER',
        organization: 'Tesla'
    };
    var interviewer3 = {
        username: 'amul3',
        password: password,
        email: 'amul3@yahoo.com',
        firstName: 'Amul3',
        lastName: 'Mehta',
        type: 'INTERVIEWER',
        organization: 'SpaceX'
    };

    var userModel = require('./model/user/user.model.server');
    userModel.createUser(admin);
    userModel.createUser(applicant1);
    userModel.createUser(applicant2);
    userModel.createUser(applicant3);
    userModel.createUser(recruiter1);
    userModel.createUser(recruiter2);
    userModel.createUser(interviewer1);
    userModel.createUser(interviewer2);
    userModel.createUser(interviewer3);
    var calendarModel = require('./model/calendar/calendar.model.server');
    var scheduleModel = require('./model/schedule/schedule.model.server');
    var candidateModel = require('./model/candidate/candidate.model.server');
    var positionModel = require('./model/position/position.model.server');
    var companyModel = require('./model/company/company.model.server');
    var interviewModel = require('./model/interview/interview.model.server');
    var model = {
        user: userModel,
        calendar: calendarModel,
        schedule: scheduleModel,
        candidate: candidateModel,
        position: positionModel,
        company: companyModel,
        interview: interviewModel
    };

    require('./services/user.service.server.js')(app, model);
    require("./services/playground.service.server")(app);
    require('./services/recruiter.service.server')(app, model);
    require('./services/calendar.service.server')(app, model);
    require('./services/schedule.service.server')(app, model);
    require('./services/candidate.service.server')(app, model);
    require('./services/position.service.server')(app, model);
    require('./services/company.service.server')(app, model);
    require('./services/interview.service.server')(app, model);
    require('./services/admin.service.server')(app,model);
};