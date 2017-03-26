/**
 * Created by rohansapre on 3/21/17.
 */
module.exports = function (app) {
    var userModel = require('./model/user/user.model.server');
    require('./services/user.service.server.js')(app, userModel);
    require("./services/playground.service.server")(app);

};
