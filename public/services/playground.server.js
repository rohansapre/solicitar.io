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
        console.log("jhhhhhhhhg");
        firebase.initializeApp(config   );

        var api = {
            "getRef": getRef,
            "compile" : compile,
            "getSubmissionResult": getSubmissionResult,
            "getToken": getToken,
            "getLanguages": getLanguages
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
            // return $http({
            //         method: 'POST',
            //             url: link,
            //         data: data,
            //     headers: {
            //             'Content-Type': undefined
            //     }
            //      });
            //return $http({
            //     method: 'POST',
            //         url: link,
            //     data: data
            // });
            // //return $http.post(link,data);

            // var RUN_URL = 'https://api.hackerearth.com/v3/code/run/';
            // var CLIENT_SECRET = '397d4ae48a515a5866d3cd5af1e5f0dafe7a5a02';
            //
            // source = "print 'Hello World'";
            //
            // data = {
            //     'client_secret': CLIENT_SECRET,
            //     'async': 0,
            //     'source': source,
            //     'lang': "PYTHON",
            //     'time_limit': 5,
            //     'memory_limit': 262144
            // };
            // return $http.post(RUN_URL,data);

        }
        function getSubmissionResult(id) {
            var link='http://00d6810d.compilers.sphere-engine.com/api/v3/submissions/'+id +'?access_token=87cb4675d1197af6ff974ac87ab2e1fe&withSource=true&withInput=true&withOutput=true&withStderr=true&withCmpinfo=true';
            console.log(link);
            return $http.get(link);
        }

        function getLanguages() {
            return $http.get("http://00d6810d.compilers.sphere-engine.com/api/v3/languages?access_token=87cb4675d1197af6ff974ac87ab2e1fe");
        }
    }
})();