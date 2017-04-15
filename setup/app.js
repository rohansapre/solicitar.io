module.exports = function(app)
{
    var connectionString = 'mongodb://127.0.0.1:27017/solicitar';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    var mongoose = require("mongoose");
    // var bcrypt = require("bcrypt");
    // var SALT_WORK_FACTOR = 10;
    mongoose.connect(connectionString);

    var firebase = require('firebase');



    var config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        databaseURL: process.env.FIREBASE_DATABASEURL,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGINGID
    };

    firebase.initializeApp(config);

    // console.log("initialized firebase");
    // console.log(firebase);


};