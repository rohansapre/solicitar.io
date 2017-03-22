/**
 * Created by tushargupta on 3/21/17.
 */
module.exports = function(app) {
    require("./services/user.service.server.js")(app);
}