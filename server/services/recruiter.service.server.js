/**
 * Created by rohansapre on 3/25/17.
 */
module.exports = function (app) {
    app.post("/api/recruiter", sendInvitations);

    function sendInvitations(req, res) {
        // var emails = request.body;
        var https = require('https');
        var data = {
            'name': 'Rohan Sapre',
            'contact': {
                'company': 'solicitar.io',
                'address1': '1171 Boylston Street',
                'city': 'Boston',
                'state': 'MA',
                'zip': '02215',
                'country': 'US',
                'phone': ''
            },
            'permission_reminder': "You are receiving this email because you have been invited to join solicitar.io to continue with your interview process",
            'campaign_defaults': {
                'from_name': 'Rohan Sapre',
                'from_email': 'rohansapre@yahoo.com',
                'subject': '',
                'language': 'en'
            },
            'email_type_option': true
        };
        var stringData = JSON.stringify(data);

        var user = process.env.MAILCHIMP_API_KEY;
        var path = '/3.0/';
        var host = 'us15.api.mailchimp.com';
        var options = {
            host: host,
            path: path,
            method: 'GET',
            auth: user
        };

        console.log(options);

        console.log("Reached server, sending request");

        var request = https.request(options, function (response) {
            console.log(response.statusCode);
            console.log(JSON.stringify(response.headers));
            response.on('data', function (d) {
                res.json(JSON.parse(d));
            });
        });
        request.end();
    }
};