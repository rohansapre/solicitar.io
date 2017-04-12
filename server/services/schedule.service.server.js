/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, model) {
    app.post("/api/schedule", createOrUpdateInterview);
    app.get("/api/schedule/upcoming/:interviewerId", getUpcomingPositions);
    app.get("/api/schedule/past/:interviewerId", getPastPositions);
    app.get("/api/schedule/upcoming/:interviewerId/position/:positionId", getCandidatesForUpcomingPositions);
    app.get("/api/schedule/past/:interviewerId/position/:positionId", getCandidatesForPastPositions);
    app.put("/api/schedule/:scheduleId", updateInterviewTime);
    app.get("/api/schedule/applicant/upcoming/:userId", getUpcomingInterviewsForApplicant);
    app.get("/api/schedule/applicant/past/:userId", getPastInterviewsForApplicant);
    app.get("/api/schedule/:interviewerId", getInterviewerSchedule);
    app.get("/api/schedule/interviewer/next/:interviewerId", getNextInterviewForInterviewer);
    app.get("/api/schedule/applicant/next/:applicantId", getNextInterviewForApplicant);
    app.put("/api/schedule/end/:scheduleId", endInterview);

    function createOrUpdateInterview(req, res) {
        var hire = req.body;
        if (hire.scheduleId === null) {
            model.schedule
                .createInterview(hire)
                .then(function (schedule) {
                    var firepad = createFirePadInstance();
                    model.firepad
                        .createFirepad(firepad)
                        .then(function (firepad) {
                            res.json(schedule);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                }, function (error) {
                    res.sendStatus(500).send(error);
                })
        } else {
            model.schedule
                .updateInterview(hire)
                .then(function (schedule) {
                    res.json(schedule);
                }, function (error) {
                    res.sendStatus(500).send(error);
                })
        }

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
        var interviewId = req.params.scheduleId;
        var time = req.params.time;
        model.schedule
            .updateInterviewTime(interviewId, time)
            .then(function (interview) {
                model.user
                    .updateStatus(interview._applicant, 'WAITING')
                    .then(function (user) {
                        res.json(interview);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
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
    // Firepad Instance Creation
    // returns a unique key which is used to get firebase db refrence
    function createFirePadInstance() {
        var firebase = require('firebase');
        var firebaseRef = firebase.database().ref();
        var dbRef = firepadRef.child('solicitarInterview').push();
        var key = dbRef.key;
        firebaseRef.child("solicitarInterview").child(key).set({
            "language": "Python"
        });
        return key;
    }

    function getNextInterviewForInterviewer(req, res) {
        var interviewerId = req.params.interviewerId;
        model.schedule
            .getNextInterviewForInterviewer(interviewerId)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function getNextInterviewForApplicant(req, res) {
        var applicantId = req.params.applicantId;
        model.schedule
            .getNextInterviewForApplicant(applicantId)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function endInterview(req, res) {
        var interviewId = req.params.scheduleId;
        model.schedule
            .endInterview(interviewId)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};