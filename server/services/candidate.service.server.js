/**
 * Created by rohansapre on 4/3/17.
 */
module.exports = function (app, model) {
    app.get("/api/candidate/:positionId", getCandidates);
    app.delete("/api/candidate/:candidateId", deleteCandidate);

    function getCandidates(req, res) {
        var positionId = req.params.positionId;
        console.log("server getting candidates");
        model.candidate
            .getApplicants(positionId)
            .then(function (candidates) {
                console.log("In Server");
                console.log(candidates.length);
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function deleteCandidate(req, res) {
        var candidateId = req.params.candidateId;
        model.candidate
            .deleteCandidate(candidateId)
            .then(function (candidate) {
                console.log(candidate);
                res.json(candidate);
            }, function (error) {
                console.log(error);
                res.sendStatus(500).send(error);
            })
    }
};