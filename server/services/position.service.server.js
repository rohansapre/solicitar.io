/**
 * Created by rohansapre on 4/5/17.
 */
module.exports = function (app, model) {
    app.post("/api/position/:userId", createPosition);
    app.get("/api/position/:userId", getPositions);

    function createPosition(req, res) {
        var recruiterId = req.params.userId;
        var position = req.body;
        position._recruiter = recruiterId;
        model.position
            .createPosition(position)
            .then(function (position) {
                res.json(position);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function getPositions(req, res) {
        var recruiterId = req.params.userId;
        model.position
            .getPositions(recruiterId)
            .then(function (positions) {
                req.json(positions);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};