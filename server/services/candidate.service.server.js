/**
 * Created by rohansapre on 4/3/17.
 */
module.exports = function (app, model) {
    app.get("/api/candidate/:userId", getCandidates);

    function getCandidates(req, res) {
        var recruiterId = req.params.userId;
        console.log("server getting candidates");
        model.candidate
            .getApplicantsForRecruiter(recruiterId)
            .then(function (candidates) {
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};