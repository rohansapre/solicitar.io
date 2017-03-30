/**
 * Created by rohansapre on 3/22/17.
 */
module.exports = function (app, userModel) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    // Image Upload Settings

    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cd) {
            cd(null, __dirname + "/../../public/uploads/images")
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length-1];
            cb(null, 'profile_' + Date.now() + '.' + extension);
        }
    });
    var upload = multer({storage: storage});

    // routes
    app.post("/api/upload/image", upload.single('profile-picture'), uploadImage);

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                if(error.duplicate) {
                    res.statusMessage = JSON.stringify(error);
                    res.status(500).end();
                } else
                    res.sendStatus(500).send(error);
            })
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password)
            findUserByCredentials(req, res);
        else
            findUserByUsername(req, res);
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                console.log(user);
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        userModel
            .findUserByUsername(username)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(userId, newUser)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel.deleteUser(userId)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function uploadImage(req, res) {
        var userId = req.body.userId;
        var picture = req.file;
        var user = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            picture: req.protocol + '://' + req.get('host') + '/uploads/images/' + picture.filename
        };
        if (picture) {
            console.log(picture.destination);
            userModel.updateUser(userId, user)
                .then(function (user) {
                    res.redirect("/#/user/" + userId);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
    }
};