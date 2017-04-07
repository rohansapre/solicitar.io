/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, model) {
    app.post("/api/schedule", createInterview);
    app.get("/api/schedule/upcoming/:interviewerId", getUpcomingPositions);
    app.get("/api/schedule/past/:interviewerId", getPastPositions);
    app.get("/api/schedule/upcoming/:interviewerId/position/:positionId", getCandidatesForUpcomingPositions);
    app.get("/api/schedule/past/:interviewerId/position/:positionId", getCandidatesForPastPositions);
    app.put("/api/schedule/:interviewId", updateInterviewTime);
    app.get("/api/schedule/applicant/upcoming/:userId", getUpcomingInterviewsForApplicant);
    app.get("/api/schedule/applicant/past/:userId", getPastInterviewsForApplicant);
    app.get("/api/schedule/:interviewerId", getInterviewerSchedule);

    function createInterview(req, res) {
        var hire = req.body;
        model.schedule
            .createInterview(hire)
            .then(function (interview) {
                res.json(interview)
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function getUpcomingPositions(req, res) {
        var interviewerId = req.params.interviewerId;
        console.log("reached upcoming positions");
        model.schedule
            .getUpcomingPositions(interviewerId)
            .then(function (positions) {
                console.log("position server");
                console.log(positions);
                res.json(positions);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function getPastPositions(req, res) {
        var interviewerId = req.params.interviewerId;
        model.schedule
            .getPastPositions(interviewerId)
            .then(function (positions) {
                console.log("position server");
                console.log(positions);
                res.json(positions);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function getCandidatesForUpcomingPositions(req, res) {
        var interviewerId = req.params.interviewerId;
        var positionId = req.params.positionId;
        model.schedule
            .getCandidatesForUpcomingPositions(interviewerId, positionId)
            .then(function (candidates) {
                console.log(candidates);
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function getCandidatesForPastPositions(req, res) {
        var interviewerId = req.params.interviewerId;
        var positionId = req.params.positionId;
        model.schedule
            .getCandidatesForPastPositions(interviewerId, positionId)
            .then(function (candidates) {
                console.log(candidates);
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function updateInterviewTime(req, res) {
        var interviewId = req.params.interviewId;
        var time = req.params.time;
        model.schedule
            .updateInterviewTime(interviewId, time)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function getUpcomingInterviewsForApplicant(req, res) {
        var userId = req.params.userId;
        model.schedule
            .getUpcomingInterviewsForApplicant(userId)
            .then(function (interviews) {
                console.log(interviews);
                res.json(interviews);
            }, function (error) {
                console.log("error");
                console.log(error);
                res.sendStatus(500).send(error);
            })
    }

    function getPastInterviewsForApplicant(req, res) {
        var userId = req.params.userId;
        model.schedule
            .getPastInterviewsForApplicant(userId)
            .then(function (interviews) {
                console.log(interviews);
                res.json(interviews);
            }, function (error) {
                console.log("error");
                console.log(error);
                res.sendStatus(500).send(error);
            })
    }

    function getInterviewerSchedule(req, res) {
        var interviewerId = req.params.interviewerId;
        model.schedule
            .getInterviewerSchedule(interviewerId)
            .then(function (interviews) {
                res.json(interviews);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};