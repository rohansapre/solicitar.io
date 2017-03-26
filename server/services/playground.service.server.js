/**
 * Created by amulmehta on 3/25/17.
 */
module.exports = function (app) {
    app.post("/api/playground", compileIt);

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