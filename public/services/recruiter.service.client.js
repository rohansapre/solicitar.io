/**
 * Created by rohansapre on 3/25/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("RecruiterService", recruiterService);

    function recruiterService($http) {

        var api = {
            "sendInvitations": sendInvitations
        };
        return api;

        function sendInvitations(emails) {
            console.log("sending to server");
            return $http.post("/api/recruiter", emails);
        }
    }
})();