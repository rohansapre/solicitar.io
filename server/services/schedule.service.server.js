/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, model) {
    app.post("/api/schedule/:userId", getInterviewers);

    function getInterviewers(req, res) {
        var userId = req.params.userId;
        var hire = req.body;

        model.user
            .findUserById(hire._recruiter)
            .then(function (recruiter) {
                model.user
                    .getInterviewersForCompany(recruiter.organization)
                    .then(function (interviewers) {
                        model.calendar
                            .getInterviewerAvailability(interviewers)
                            .then(function (calendar) {
                                model.user
                                    .findUserById(userId)
                                    .then(function (user) {
                                        scheduleInterview(user, calendar);
                                    }, function (error) {
                                        res.sendStatus(500).send(error);
                                    })
                            }, function (error) {
                                res.sendStatus(500).send(error);
                            })
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    })
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function scheduleInterview(user, calendar) {

        for (var i in calendar) {

        }





        model.schedule
            .scheduleInterview(userId, hire)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};