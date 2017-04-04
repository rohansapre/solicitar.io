/**
 * Created by rohansapre on 3/25/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("RecruiterService", recruiterService);

    function recruiterService($http) {

        var api = {
            "sendInvitations": sendInvitations,
            "getCandidates": getCandidates
        };
        return api;

        function sendInvitations(emails) {
            console.log("sending to server");
            return $http.post("/api/recruiter", emails);
        }

        function getCandidates(userId) {
            console.log("Inside recruiter.service.client.js");
            return $http.get("/api/candidate/" + userId);
        }
    }
})();