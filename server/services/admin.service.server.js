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
        var flag = false;
        if ("undefined" !== typeof user._recruiter)
            flag = true;
        console.log(flag);
        console.log(user);
        model.user
            .createUser(user)
            .then(function (user) {
                console.log("created user");
                if (flag) {
                    var company = {
                        _recruiter: user._recruiter,
                        _interviewer: user._id
                    };
                    model.company
                        .createCompany(company)
                        .then(function (newCompany) {
                            console.log("created company");
                            res.json(user);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        })
                } else
                    res.json(user);
            }, function (error) {
                console.log(error);
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