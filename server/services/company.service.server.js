/**
 * Created by rohansapre on 4/8/17.
 */
module.exports = function (app, model) {
    app.post("/api/company/:recruiterId", createInterviewer);
    app.get("/api/company/:recruiterId", getInterviewers);
    app.delete("/api/company/:interviewerId", deleteInterviewer);

    function createInterviewer(req, res) {
        var recruiterId = req.params.recruiterId;
        var interviewer = req.body;
        model.user
            .createUser(interviewer)
            .then(function (user) {
                var company = {
                    _recruiter: recruiterId,
                    _interviewer: user._id
                };
                model.company
                    .createCompany(company)
                    .then(function (newCompany) {
                        res.json(user);
                    }, function (err) {
                        res.sendStatus(500).send(err);
                    })
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function getInterviewers(req, res) {
        var recruiterId = req.params.recruiterId;
        model.company
            .getInterviewers(recruiterId)
            .then(function (interviewers) {
                res.json(interviewers);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function deleteInterviewer(req, res) {
        var interviewerId = req.params.interviewerId;
        model.user
            .deleteUser(interviewerId)
            .then(function (user) {
                model.company
                    .deleteCompany(interviewerId)
                    .then(function (interview) {
                        res.json(user);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    })
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};