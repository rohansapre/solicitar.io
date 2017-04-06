/**
 * Created by rohansapre on 3/25/17.
 */
module.exports = function (app, model) {
    app.post("/api/recruiter/:positionId", filterApplicants);

    var https = require('https');
    var user = process.env.MAILCHIMP_API_KEY;
    var host = 'us15.api.mailchimp.com';

    function filterApplicants(req, res) {
        var positionId = req.params.positionId;
        var applicants = req.body;
        var emails = [];
        for (var a in applicants) {
            emails.push(applicants[a].email);
        }
        model.user
            .findUsersByEmails(emails)
            .then(function (users) {
                var existing = [];
                var existingEmails = [];
                for (var u in users) {
                    existing.push(users[u]._id);
                    existingEmails.push(users[u].email);
                }
                var newApplicants = filterNewApplicants(existingEmails, applicants);
                newApplicants = addDefaultUsernamePassword(newApplicants);
                model.user
                    .insertUsers(newApplicants)
                    .then(function (newUsers) {
                        var invitationEmails = [];
                        for (var u in newUsers) {
                            existing.push(newUsers[u]._id);
                            invitationEmails.push(newUsers[u].email);
                        }
                        updateExistingUsers(positionId, existing, invitationEmails, res);
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function filterNewApplicants(existing, applicants) {
        for (var e in applicants) {
            if(existing.indexOf(applicants[e].email) > -1) {
                applicants.splice(e, 1);
            }
        }
        return applicants;
    }

    function addDefaultUsernamePassword(applicants) {
        for (var a in applicants) {
            applicants[a].username = applicants[a].email;
            applicants[a].password = getRandomizedString(32);
        }
        return applicants;
    }

    function getRandomizedString(size) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = size; i > 0; --i)
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    function updateExistingUsers(positionId, users, emails, res) {
        model.candidate
            .insertApplicants(positionId, users)
            .then(function (candidates) {
                console.log("update existing users");
                console.log(candidates);
                createInviteList(emails, res);
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function createInviteList(emails, res) {
        var data = {
            'name': 'Invite' + getRandomizedString(5),
            'contact': {
                'company': 'solicitar.io',
                'address1': '1171 Boylston Street',
                'city': 'Boston',
                'state': 'MA',
                'zip': '02215',
                'country': 'US'
            },
            'permission_reminder': "You are receiving this email because you have been invited to join solicitar.io to continue with your interview process",
            'campaign_defaults': {
                'from_name': 'Rohan Sapre',
                'from_email': 'rohansapre@yahoo.com',
                'subject': 'Invitation to solicitar.io',
                'language': 'en'
            },
            'email_type_option': true
        };
        var stringData = JSON.stringify(data);
        var path = '/3.0/lists';
        var options = {
            host: host,
            method: 'POST',
            path: path,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringData)
            },
            auth: user
        };

        var request = https.request(options, function (response) {
            var body = '';
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                console.log("InviteList Created, adding Recipients");
                addRecipients(parsed, emails, res);
            });
        });
        request.write(stringData);
        request.end();
    }

    function addRecipients(list, emails, res) {
        var members = [];
        for (var i in emails) {
            var member = {
                email_address: emails[i],
                email_type: 'html',
                status: 'subscribed'
            };
            members.push(member);
        }
        var data = {
            members: members
        };
        var stringData = JSON.stringify(data);
        console.log(list.id);
        var path = '/3.0/lists/' + list.id;
        var options = {
            host: host,
            method: 'POST',
            path: path,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringData)
            },
            auth: user
        };

        var request = https.request(options, function (response) {
            var body = '';
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                console.log("Errors: " + parsed.errors);
                if (parsed.errors.length === 0)
                    createCampaign(list, res);
                else
                    console.log(parsed.errors);
            });
        });
        request.write(stringData);
        request.end();
    }

    function createCampaign(list, res) {
        var campaign_id = process.env.MAILCHIMP_CAMPAIGN_ID;

        var path = '/3.0/campaigns/' + campaign_id + '/actions/replicate';
        var options = {
            host: host,
            method: 'POST',
            path: path,
            auth: user
        };

        var request = https.request(options, function (response) {
            var body = '';
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                console.log("Campaign created, adding invite list");
                addInviteList(parsed, list, res);
            });
        });
        request.end();
    }

    function addInviteList(campaign, list, res) {

        var recipients = {
            list_id: list.id
        };
        var data = {
            recipients: recipients,
            settings: {
                subject_line: 'Welcome to solicitar.io!',
                from_name: 'Rohan Sapre',
                reply_to: 'rohansapre@yahoo.com'
            }
        };
        var stringData = JSON.stringify(data);

        var path = '/3.0/campaigns/' + campaign.id;
        var options = {
            host: host,
            method: 'PATCH',
            path: path,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringData)
            },
            auth: user
        };

        var request = https.request(options, function (response) {
            var body = '';
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                console.log("InviteList added, final sending");
                sendInvitations(parsed, res);
            });
        });
        request.write(stringData);
        request.end();
    }

    function sendInvitations(campaign, res) {

        var path = '/3.0/campaigns/' + campaign.id + '/actions/send';
        var options = {
            host: host,
            method: 'POST',
            path: path,
            auth: user
        };

        var request = https.request(options, function (response) {
            var body = '';
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function() {
                res.send(body);
            });
        });
        request.end();
    }
};