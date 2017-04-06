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

//58e2be25b6dd161f985efea6
//58e2be25b6dd161f985efea7
//58e2be25b6dd161f985efea5
//58dc6c43f41bae69ea4958ef
//58dc6c43f41bae69ea4958ef