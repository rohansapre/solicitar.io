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
            "getCandidates": getCandidates,
            "scheduleInterview": scheduleInterview
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

        //  Schedule Interview
        // hire = {
        //     _recruiter: recruiterId,
        //     position: position
        // }

        function scheduleInterview(userId, hire) {
            return $http.post("/api/schedule/" + userId, hire);
        }
    }
})();