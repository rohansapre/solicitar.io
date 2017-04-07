/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, model) {
    // app.post("/api/schedule/:interviewerId", createInterview);
    app.get("/api/schedule/upcoming/:interviewerId", getUpcomingPositions);
    app.get("/api/schedule/past/:interviewerId", getPastPositions);
    app.get("/api/schedule/:interviewerId/position/:positionId", getCandidatesForPosition)
    app.put("/api/schedule/:interviewId", updateInterviewTime)

    function createInterview(req, res) {
        var interviewerId = req.params.interviewerId;
        var hire = req.body;
        hire._interviewer = interviewerId;
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

    function getCandidatesForPosition(req, res) {
        var interviewerId = req.params.interviewerId;
        var positionId = req.params.positionId;
        model.schedule
            .getCandidatesForPosition(interviewerId, positionId)
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