/**
 * Created by rohansapre on 3/21/17.
 */
module.exports = function (app) {
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

    var userModel = require('./model/user/user.model.server');
    userModel.createUser(applicant);
    userModel.createUser(recruiter);
    userModel.createUser(interviewer);
    var calendarModel = require('./model/calendar/calendar.model.server');
    var scheduleModel = require('./model/schedule/schedule.model.server');
    var model = {
        user: userModel,
        calendar: calendarModel,
        schedule: scheduleModel
    };
    require('./services/user.service.server.js')(app, model);
    require("./services/playground.service.server")(app);
    require('./services/recruiter.service.server')(app);
    require('./services/calendar.service.server')(app, model);
    require('./services/schedule.service.server')(app, model);
};
