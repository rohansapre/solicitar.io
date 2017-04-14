/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, model) {
    app.post("/api/schedule", createInterview);
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
    app.get("/api/schedule/interviews/:positionId", getScheduledInterviews);

    function createInterview(req, res) {
        var hire = req.body;
        console.log("hire");
        console.log(hire);
        model.schedule
            .createInterview(hire)
            .then(function (schedule) {
                console.log("schedule");
                console.log(schedule);
                res.json(schedule);
                // var fp = createFirePadInstance();
                // console.log(fp);
                // model.firepad
                //     .createFirepad(fp)
                //     .then(function (firepad) {
                //         console.log("firepad");
                //         console.log(firepad);
                //         res.json(schedule);
                //     }, function (error) {
                //         res.sendStatus(500).send(error);
                //     });
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    // MAKE IT BOUG FREE
    function getUpcomingPositions(req, res) {
        var interviewerId = req.params.interviewerId;
        console.log("reached upcoming positions");
        model.schedule
            .getUpcomingPositions(interviewerId)
            .then(function (positions) {
                console.log("position server");
                console.log(positions);
                model.schedule
                    .getPositionsByIds(positions)
                    .then(function (posObjs) {
                        console.log(posObjs[0]);
                        var arr=[];
                        arr.push(posObjs[0]);
                        res.json(arr);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
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
                // res.json(positions);
                model.schedule
                    .getPositionsByIds(positions)
                    .then(function (posObjs) {
                        console.log(posObjs[0]);
                        var arr=[];
                        arr.push(posObjs[0]);
                        res.json(arr);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
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
        var time = req.body;
        model.schedule
            .updateInterviewTime(interviewId, time)
            .then(function (interview) {
                console.log("after update");
                console.log(interview);
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
        console.log(interviewerId);
        model.schedule
            .getInterviewerSchedule(interviewerId)
            .then(function (interviews) {
                console.log("interviews");
                console.log(interviews);
                res.json(interviews);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
    // Firepad Instance Creation
    // returns a unique key which is used to get firebase db refrence
    function createFirePadInstance() {
        console.log("sdljfhsdflksdf");
        var firebase = require('firebase');
        var firebaseRef = firebase.database().ref();
        var dbRef = firebaseRef.child('solicitarInterview').push();
        var key = dbRef.key;
        // firebaseRef.child("solicitarInterview").child(key).set({
        //     "language": "Python"
        // });
        console.log(key);
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

    function getScheduledInterviews(req, res) {
        var positionId = req.params.positionId;
        console.log(positionId);
        model.schedule
            .getScheduledInterviews(positionId)
            .then(function (interviews) {
                console.log(interviews);
                res.json(interviews);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};