/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var q = require('q');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('User', userSchema);

// api

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByCredentials = findUserByCredentials;

module.exports = userModel;

function createUser(user) {
    var d = q.defer();
    userModel.create(user, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}

function findUserById(userId) {
    var d = q.defer();
    userModel.findById(userId, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}

function findUserByUsername(username) {
    var d = q.defer();
    userModel.findOne({username: username}, function (err, user) {
        if(err)
            d.reject(err)
        else
            d.resolve(user);
    });
    return d.promise;
}

function findUserByCredentials(username, password) {
    var d = q.defer();
    userModel.findOne({username: username, password: password}, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}