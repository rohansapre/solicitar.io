/**
 * Created by amulmehta on 3/25/17.
 */
module.exports = function (app) {
    app.post("/api/playground", compileIt);
    app.get("/twilio/token",getToken);


    //  -- TWilio Server ------

    function getToken(request,response) {

        var AccessToken = require('twilio').AccessToken;
        var VideoGrant = AccessToken.VideoGrant;


        var identity = randomUsername(); // replace with the username of calling party

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        var token = new AccessToken(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_API_KEY,
            process.env.TWILIO_API_SECRET
        );

        // Assign the generated identity to the token
        token.identity = identity;

        //grant the access token Twilio Video capabilities
        var grant = new VideoGrant();
        grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
        token.addGrant(grant);

        // Serialize the token to a JWT string and include it in a JSON response
        response.send({
            identity: identity,
            token: token.toJwt()
        });
    }


    var ADJECTIVES = [
        'Abrasive', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden',
        'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty',
        'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry',
        'Unique', 'Vivacious', 'Wicked', 'Xenophobic', 'Yawning', 'Zesty'
    ];

    var FIRST_NAMES = [
        'Anna', 'Bobby', 'Cameron', 'Danny', 'Emmett', 'Frida', 'Gracie', 'Hannah',
        'Isaac', 'Jenova', 'Kendra', 'Lando', 'Mufasa', 'Nate', 'Owen', 'Penny',
        'Quincy', 'Roddy', 'Samantha', 'Tammy', 'Ulysses', 'Victoria', 'Wendy',
        'Xander', 'Yolanda', 'Zelda'
    ];

    var LAST_NAMES = [
        'Anchorage', 'Berlin', 'Cucamonga', 'Davenport', 'Essex', 'Fresno',
        'Gunsight', 'Hanover', 'Indianapolis', 'Jamestown', 'Kane', 'Liberty',
        'Minneapolis', 'Nevis', 'Oakland', 'Portland', 'Quantico', 'Raleigh',
        'SaintPaul', 'Tulsa', 'Utica', 'Vail', 'Warsaw', 'XiaoJin', 'Yale',
        'Zimmerman'
    ];

    function randomUsername() {
        function rando(arr) {
            return arr[Math.floor(Math.random()*arr.length)];
        }
        return rando(ADJECTIVES) + rando(FIRST_NAMES) + rando(LAST_NAMES);
    }


    //-------------------------------------------------

    function compileIt(req, resp){
        var data = req.body;
        console.log(data);
        var http = require("http");
        var host ='00d6810d.compilers.sphere-engine.com' ;
        var path = '/api/v3/submissions?access_token=87cb4675d1197af6ff974ac87ab2e1fe';
        var options = {
            host: host,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        console.log("fdsfddfd");
        var r = http.request(options, function(res) {
            console.log('Status: ' + res.statusCode);
            console.log('Headers: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (body) {
                console.log('Body: ' + body);
                resp.json(JSON.parse(body));
            });
        });
        r.write(JSON.stringify(data));
        r.end()



    }
};