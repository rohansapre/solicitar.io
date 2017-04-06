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
            "scheduleInterview": scheduleInterview,
            "createPosition": createPosition,
            "getPositions": getPositions,
            "deletePosition": deletePosition
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

        function createPosition(recruiterId, position) {
            return $http.post("/api/position/" + recruiterId, position);
        }

        function getPositions(recruiterId) {
            return $http.get("/api/position/" + recruiterId);
        }

        function deletePosition(positionId) {
            console.log("sending from client position delete");
            return $http.delete("/api/position/" + positionId);
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