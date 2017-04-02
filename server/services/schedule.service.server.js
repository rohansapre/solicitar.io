/**
 * Created by rohansapre on 4/2/17.
 */

module.exports = function (app, scheduleModel) {
    app.post("/api/schedule/:userId", scheduleInterview);

    function scheduleInterview(req, res) {
        var userId = req.params.userId;
        var hire = req.body;
        scheduleModel.scheduleInterview(userId, hire)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};