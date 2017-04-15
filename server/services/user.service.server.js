/**
 * Created by rohansapre on 3/22/17.
 */
module.exports = function (app, model) {

    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    };

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };

    var bcrypt = require('bcrypt-nodejs');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var FacebookStrategy = require('passport-facebook').Strategy;
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    app.post("/api/user", createUser);
    app.get("/api/user", findUserByUsername);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.get("/api/loggedin", loggedin);

    app.get("/auth/facebook", passport.authenticate('facebook', {scope: 'email'}));
    app.get("/auth/facebook/callback", passport.authenticate('facebook', {
        failureRedirect: '/#/'
    }), FacebookGoogleCallback);

    app.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get("/auth/google/callback", passport.authenticate('google', {
        failureRedirect: '/#/'
    }), FacebookGoogleCallback);

    function FacebookGoogleCallback(req, res) {
        if (req.user.message) {
            res.redirect('/#/');
        } else {
            var url = '/#/user/' + req.user._id.toString();
            res.redirect(url);
        }
    }

    // Image Upload Settings

    var multer = require('multer');
    var image_storage = multer.diskStorage({
        destination: function (req, file, cd) {
            cd(null, __dirname + "/../../public/uploads/images")
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'profile_' + Date.now() + '.' + extension);
        }
    });
    var image_upload = multer({storage: image_storage});

    var resume_storage = multer.diskStorage({
        destination: function (req, file, cd) {
            cd(null, __dirname + "/../../public/uploads/resumes")
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'profile_' + Date.now() + '.' + extension);
        }
    });
    var resume_upload = multer({storage: resume_storage});

    var coverLetter_storage = multer.diskStorage({
        destination: function (req, file, cd) {
            cd(null, __dirname + "/../../public/uploads/coverletters")
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'profile_' + Date.now() + '.' + extension);
        }
    });
    var coverLetter_upload = multer({storage: coverLetter_storage});

    // routes
    app.post("/api/upload/image", image_upload.single('profile-picture'), uploadImage);
    app.post("/api/upload/resume", resume_upload.single('resume'), uploadResume);
    app.post("/api/upload/cover-letter", coverLetter_upload.single('cover-letter'), uploadCoverLetter);

    function createUser(req, res) {
        var newUser = req.body;
        model.user
            .findUserByUsername(newUser.email)
            .then(function (user) {
                if (user) {
                    newUser.status = 'JOINED';
                    newUser.password = bcrypt.hashSync(newUser.password);
                    model.user
                        .updateUser(user._id, newUser)
                        .then(function (tempUser) {
                            res.json(tempUser);
                        }, function (error) {
                            if (error.duplicate) {
                                res.statusMessage = JSON.stringify(error);
                                res.status(500).end();
                            } else
                                res.sendStatus(500).send(error);
                        })
                } else {
                    var error = {
                        "message": "You have not been invited yet, you can't register without an invitation"
                    };
                    res.statusMessage = JSON.stringify(error);
                    res.status(500).end();
                }
            }, function (error) {
                console.log("error");
                console.log(error);
                res.sendStatus(500).send(error);
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.user
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.user
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

    function uploadImage(req, res) {
        var userId = req.body.userId;
        if (req.file) {
        var picture = req.file;
        var user = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            picture: req.protocol + '://' + req.get('host') + '/uploads/images/' + picture.filename
        };
        if (picture) {
            console.log(picture.destination);
            model.user
                .updateUser(userId, user)
                .then(function (user) {
                    res.redirect("/#/user/" + userId);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
        }
    }

    function uploadResume(req, res) {
        var userId = req.body.userId;
        if (req.file) {
            var resume = req.file;
            var resumePath = req.protocol + '://' + req.get('host') + '/uploads/resumes/' + resume.filename;
            console.log(resume);
            if (resume) {
                model.user
                    .updateUserFile(userId, resumePath, true)
                    .then(function (user) {
                        res.redirect("/#/user/" + userId);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
            }
        }
    }


function uploadCoverLetter(req, res) {
    var userId = req.body.userId;
    if (req.file) {
        var coverLetter = req.file;
        var coverLetterPath = req.protocol + '://' + req.get('host') + '/uploads/coverletters/' + coverLetter.filename;
        console.log(coverLetter);
        if (coverLetter) {
            model.user
                .updateUserFile(userId, coverLetterPath, false)
                .then(function (user) {
                    res.redirect("/#/user/" + userId);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
    }
}

    function localStrategy(username, password, done) {
        model.user
            .findUserByUsername(username)
            .then(function (user) {
                if (user && bcrypt.compareSync(password, user.password))
                    return done(null, user);
                else
                    return done(null, false);
            }, function (err) {
                if (err)
                    return done(err);
            });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.user
            .findUserById(user._id)
            .then(function (user) {
                done(null, user);
            }, function (err) {
                done(err, null);
            })
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var newUser = req.body;
        model.user
            .findUserByUsername(newUser.email)
            .then(function (user) {
                if (user) {
                    newUser.status = 'JOINED';
                    newUser.password = bcrypt.hashSync(newUser.password);
                    model.user
                        .updateUser(user._id, newUser)
                        .then(function (tempUser) {
                            if (tempUser) {
                                req.login(tempUser, function (err) {
                                    if (err)
                                        res.status(400).send(err);
                                    else
                                        res.json(tempUser);
                                })
                            }
                        }, function (error) {
                            if (error.duplicate) {
                                res.statusMessage = JSON.stringify(error);
                                res.status(500).end();
                            } else
                                res.sendStatus(500).send(error);
                        })
                } else {
                    console.log("reached else error");
                    var error = {
                        "message": "You have not been invited yet, you can't register without an invitation"
                    };
                    res.json(error);
                    // res.statusMessage = JSON.stringify(error);
                    // res.status(500).end();
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        console.log("reached facebook callback");
        model.user
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                console.log("find FB id");
                console.log(user);
                if (user) {
                    console.log("reached user");
                    return done(null, user);
                }
                else {
                    console.log("reached else");
                    var name = profile.displayName.split(" ");
                    var fbUser = {
                        firstName: name[0],
                        lastName: name[1],
                        facebook: {
                            id: profile.id,
                            token: token
                        },
                        email: profile.emails[0].value
                    };
                    console.log(fbUser);
                    model.user
                        .findUserByUsername(fbUser.email)
                        .then(function (foundUser) {
                            console.log("user by username");
                            console.log(foundUser);
                            if (foundUser) {
                                fbUser.status = 'JOINED';
                                model.user
                                    .updateUser(foundUser._id, fbUser)
                                    .then(function (tempUser) {
                                        console.log("updated user");
                                        if (tempUser) {
                                            return done(null, foundUser);
                                        }
                                    });
                            } else {
                                var error = {
                                    "message": "You have not been invited yet, you can't register without an invitation"
                                };
                                console.log("username error");
                                console.log(error);
                                return done(null, error);
                            }
                        }, function (error) {
                            if (error)
                                return done(null, error);
                        });
                }
            })
    }

    function googleStrategy(token, refreshToken, profile, done) {
        console.log("reached google callback");
        model.user
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                console.log("find Google id");
                console.log(user);
                if (user) {
                    console.log("reached user");
                    return done(null, user);
                }
                else {
                    console.log("reached else");
                    var email = profile.emails[0].value;
                    var googleUser = {
                        username: email.split("@")[0],
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        google: {
                            id: profile.id,
                            token: token
                        },
                        email: email
                    };
                    console.log(googleUser);
                    model.user
                        .findUserByUsername(googleUser.email)
                        .then(function (foundUser) {
                            console.log("user by username");
                            console.log(foundUser);
                            if (foundUser) {
                                googleUser.status = 'JOINED';
                                model.user
                                    .updateUser(foundUser._id, googleUser)
                                    .then(function (tempUser) {
                                        console.log("updated user");
                                        if (tempUser) {
                                            return done(null, foundUser);
                                        }
                                    });
                            } else {
                                var error = {
                                    "message": "You have not been invited yet, you can't register without an invitation"
                                };
                                console.log("username error");
                                console.log(error);
                                return done(null, error);
                            }
                        }, function (error) {
                            if (error)
                                return done(null, error);
                        });
                }
            })
    }
};