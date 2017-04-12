/**
 * Created by rohansapre on 4/11/17.
 */
module.exports = function (app, model) {


    function createUser(req, res) {
        var user = req.body;
        model.user
            .createUser(user)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findUsersByType(req, res) {
        var userType = req.body;
        model.user
            .findUsersByType(userType)
            .then(function (users) {
                res.json(users);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model.user
            .updateUser(userId, newUser)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.user
            .deleteUser(userId)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }
};