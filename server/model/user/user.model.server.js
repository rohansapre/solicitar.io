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
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.updateUserFile = updateUserFile;
userModel.getInterviewersForCompany = getInterviewersForCompany;
userModel.findUsersByEmails = findUsersByEmails;
userModel.insertUsers = insertUsers;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.updateStatus = updateStatus;

module.exports = userModel;

function createUser(user) {
    var d = q.defer();
    user.status = 'JOINED';
    userModel.create(user, function (err, user) {
        console.log(user);
        if(err) {
            var msg = err['errmsg'];
            if (msg.indexOf('duplicate key error') > -1) {
                var duplicate = {
                    'duplicate': true,
                    'field': msg.substring(msg.indexOf('index: ')+7).split('_')[0]
                };
                d.reject(duplicate);
            } else
                d.reject(err);
        }
        else {
            d.resolve(user);
        }
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
            d.reject(err);
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

function updateUser(userId, user) {
    var d = q.defer();
    userModel.findByIdAndUpdate(userId, user, function (err, user) {
        if(err) {
            var msg = err['errmsg'];
            if (msg.indexOf('duplicate key error') > -1) {
                var duplicate = {
                    'duplicate': true,
                    'field': msg.substring(msg.indexOf('index: ')+7).split('_')[0]
                };
                d.reject(duplicate);
            } else
                d.reject(err);
        }
        else {
            d.resolve(user);
        }
    });
    return d.promise;
}

function updateUserFile(userId, path, isResume) {
    var d = q.defer();
    if(isResume) {
        userModel.findByIdAndUpdate(userId, {$set: {resume: path}}, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
        });
    } else {
        userModel.findByIdAndUpdate(userId, {$set: {coverLetter: path}}, function (err, user) {
            if(err)
                d.reject(err);
            else
                d.resolve(user);
        });
    }
    return d.promise;
}

function deleteUser(userId) {
    var d = q.defer();
    userModel.findByIdAndRemove(userId, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}

function getInterviewersForCompany(organization) {
    var d = q.defer();
    userModel.find({organization: organization, type: 'INTERVIEWER'}, '_id', function (err, interviewers) {
        if(err)
            d.reject(err);
        else
            d.resolve(interviewers);
    });
    return d.promise;
}

function findUsersByEmails(emails) {
    var d = q.defer();
    userModel.find({email: {$in: emails}}, '_id email', function (err, users) {
        if(err)
            d.reject(err);
        else
            d.resolve(users);
    });
    return d.promise;
}

function insertUsers(users) {
    var d = q.defer();
    userModel.insertMany(users, function (err, users) {
        if(err)
            d.reject(err);
        else
            d.resolve(users);
    });
    return d.promise;
}

function findUserByFacebookId(facebookId) {
    var d = q.defer();
    userModel.findOne({'facebook.id': facebookId}, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}

function updateStatus(userId, status) {
    var d = q.defer();
    userModel.update({_id: userId}, {$set: {status: status}}, function (err, user) {
        if(err)
            d.reject(err);
        else
            d.resolve(user);
    });
    return d.promise;
}