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
                            res.json(interviews);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        })
                }
                // res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};