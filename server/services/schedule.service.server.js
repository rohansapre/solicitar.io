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
};