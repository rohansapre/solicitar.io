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
                console.log(candidates._applicant);
                res.json(candidates);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};

//58e2be25b6dd161f985efea6
//58e2be25b6dd161f985efea7
//58e2be25b6dd161f985efea5
//58dc6c43f41bae69ea4958ef
//58dc6c43f41bae69ea4958ef