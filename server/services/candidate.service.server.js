/**
 * Created by rohansapre on 4/3/17.
 */
module.exports = function (app, model) {
    app.get("/api/candidate/:positionId", getCandidates);

    function getCandidates(req, res) {
        var positionId = req.params.positionId;
        console.log("server getting candidates");
        model.candidate
            .getApplicants(positionId)
            .then(function (candidates) {
                console.log("In Server");
                console.log(candidates);
                if (candidates.length > 0) {
                    var recruiterId = candidates[0]._position._recruiter;
                    var applicants = [];
                    for (var c in candidates) {
                        applicants.push(candidates[c]._applicant._id);
                    }
                    model.schedule
                        .getInterviewsForRecruiter(recruiterId, applicants)
                        .then(function (interviews) {
                            var answer = [];
                            for (var c in candidates) {
                                var match = false;
                                for (var i in interviews) {
                                    if (candidates[c]._applicant._id === interviews[i]._applicant._id) {
                                        var temp = candidates[c];
                                        temp._interview = interviews[i]._interviewer;
                                        answer.push(temp);
                                        match = true;
                                        break;
                                    }
                                }
                                if (!match)
                                    answer.push(candidates[c]);
                            }
                            res.json(answer);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        })
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};