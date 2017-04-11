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
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};