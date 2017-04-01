/**
 * Created by rohansapre on 3/21/17.
 */
module.exports = function (app) {
    var userModel = require('./model/user/user.model.server');
    var applicant = {
        username: 'rohan',
        password: 'pass',
        email: 'rohan@yahoo.com',
        firstName: 'Rohan',
        lastName: 'Sapre',
        type: 'APPLICANT'
    };
    var recruiter = {
        username: 'tushar',
        password: 'pass',
        email: 'tushar@yahoo.com',
        firstName: 'Tushar',
        lastName: 'Gupta',
        type: 'RECRUITER'
    };
    var interviewer = {
        username: 'amul',
        password: 'pass',
        email: 'amul@yahoo.com',
        firstName: 'Amul',
        lastName: 'Mehta',
        type: 'INTERVIEWER'
    };
    
    userModel.createUser(applicant);
    userModel.createUser(recruiter);
    userModel.createUser(interviewer);
    require('./services/user.service.server.js')(app, userModel);
    require("./services/playground.service.server")(app);
    require('./services/recruiter.service.server')(app);
    require('./services/interview.service.server')(app);
};
