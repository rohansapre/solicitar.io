/**
 * Created by tushargupta on 3/31/17.
 */
module.exports = function (app, model) {
    app.get("/api/interview/:scheduleId", getInterviewDetails);

    function getInterviewDetails(req, res) {
        var scheduleId = req.params.scheduleId;
        model.interview
            .getInterviewDetails(scheduleId)
            .then(function (interview) {
                res.json(interview);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};