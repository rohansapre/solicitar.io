/**
 * Created by amulmehta on 3/22/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("playgroundService", playgroundService);

    function playgroundService($http) {
        var config = {
            apiKey: "AIzaSyAYz-syxAzb9v4t1jdpDCowwThCLhEqEf8",
            authDomain: "playground-9b472.firebaseapp.com",
            databaseURL: "https://playground-9b472.firebaseio.com",
            storageBucket: "playground-9b472.appspot.com",
            messagingSenderId: "406699422715"
        };
        firebase.initializeApp(config   );

        var api = {
            "getRef": getRef,
            "compile" : compile,
            "getSubmissionResult": getSubmissionResult,
            "getToken": getToken,
            "getLanguages": getLanguages,
            "getTwilioRoom": getTwilioRoom
        };
        return api;


        function getToken() {
            return $http.get('/twilio/token');
        }

        function getRef() {
            return firebase.database().ref();
        }
        function compile(data){
            var link ='http://00d6810d.compilers.sphere-engine.com/api/v3/submissions?access_token=87cb4675d1197af6ff974ac87ab2e1fe';
            return $http.post('/api/playground',data);
        }
        function getSubmissionResult(id) {
            var link='http://00d6810d.compilers.sphere-engine.com/api/v3/submissions/'+id +'?access_token=87cb4675d1197af6ff974ac87ab2e1fe&withSource=true&withInput=true&withOutput=true&withStderr=true&withCmpinfo=true';
            console.log(link);
            return $http.get(link);
        }

        function getLanguages() {
            return $http.get("http://00d6810d.compilers.sphere-engine.com/api/v3/languages?access_token=87cb4675d1197af6ff974ac87ab2e1fe");
        }

        function getTwilioRoom() {
            return $http.get("link/to/server");
        }
    }
})();