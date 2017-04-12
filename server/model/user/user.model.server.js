/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('User', userSchema);

// api

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByUsername = findUserByUsername;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.updateUserFile = updateUserFile;
userModel.getInterviewersForCompany = getInterviewersForCompany;
userModel.findUsersByEmails = findUsersByEmails;
userModel.insertUsers = insertUsers;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.updateStatus = updateStatus;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserByType = findUserByType;

module.exports = userModel;

function createUser(user) {
    var d = q.defer();
    user.status = 'JOINED';
    userModel.create(user, function (err, user) {
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
    return userModel.findById(userId);
}

function findUserByUsername(username) {
    return userModel.findOne({username: username});
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
    if(isResume) {
        return userModel.findByIdAndUpdate(userId, {$set: {resume: path}});
    } else {
        return userModel.findByIdAndUpdate(userId, {$set: {coverLetter: path}});
    }
}

function deleteUser(userId) {
    var d = q.defer();
    userModel.findByIdAndRemove(userId, function (err, user) {
        if(err)
            d.reject(err);
        else {
            user.remove();
            d.resolve(user);
        }
    });
    return d.promise;
}

function getInterviewersForCompany(organization) {
    return userModel.find({organization: organization, type: 'INTERVIEWER'}, '_id');
}

function findUsersByEmails(emails) {
    return userModel.find({email: {$in: emails}}, '_id email');
}

function insertUsers(users) {
    return userModel.insertMany(users);
}

function findUserByFacebookId(facebookId) {
    return userModel.findOne({'facebook.id': facebookId});
}

function updateStatus(userId, status) {
    return userModel.update({_id: userId}, {$set: {status: status}});
}

function findUserByGoogleId(googleId) {
    return userModel.findOne({'google.id': googleId});
}

function findUserByType(type) {
    return userModel.find({type: type});
}