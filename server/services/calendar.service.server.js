/**
 * Created by rohansapre on 4/1/17.
 */
module.exports = function (app, model) {
    app.get("/api/calendar/:userId", getAvailability);
    app.post("/api/calendar/:userId", setAvailability);
    app.put("/api/calendar/:userId", updateAvailability);

    function getAvailability(req, res) {
        var userId = req.params.userId;
        model.calendar
            .getAvailability(userId)
            .then(function (calendar) {
                res.json(calendar);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function setAvailability(req, res) {
        var userId = req.params.userId;
        var times = req.body;
        console.log("calling calendar model");
        model.calendar
            .setAvailability(userId, times)
            .then(function (calendar) {
                res.json(calendar);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function updateAvailability(req, res) {
        var userId = req.params.userId;
        var times = req.body;
        model.calendar
            .updateAvailability(userId, times)
            .then(function (calendar) {
                res.json(calendar);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};