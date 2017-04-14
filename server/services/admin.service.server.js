/**
 * Created by rohansapre on 4/11/17.
 */
module.exports = function (app, model) {
    app.get("/api/admin/users/:type", findUsersByType);
    app.post("/api/admin/user", createUser);
    app.delete("/api/admin/user/:userId", deleteUser);
    app.put("/api/admin/user/:userId", updateUser);

    var bcrypt = require('bcrypt-nodejs');

    function createUser(req, res) {
        var user = req.body;
        user.status = 'JOINED';
        user.password = bcrypt.hashSync(user.password);
        model.user
            .createUser(user)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findUsersByType(req, res) {
        var userType = req.params.type;
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