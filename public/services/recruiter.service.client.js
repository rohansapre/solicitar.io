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
            "createPosition": createPosition,
            "getPositions": getPositions,
            "deletePosition": deletePosition,
            "createInterviewer": createInterviewer,
            "getInterviewers": getInterviewers,
            "deleteInterviewer": deleteInterviewer,
            "getScheduledInterviews": getScheduledInterviews
        };
        return api;

        function sendInvitations(positionId, applicants) {
            console.log("sending to server");
            return $http.post("/api/recruiter/" + positionId, applicants);
        }

        function getCandidates(positionId) {
            return $http.get("/api/candidate/" + positionId);
        }

        function createPosition(recruiterId, position) {
            return $http.post("/api/position/" + recruiterId, position);
        }

        function getPositions(recruiterId) {
            return $http.get("/api/position/" + recruiterId);
        }

        function deletePosition(positionId) {
            return $http.delete("/api/position/" + positionId);
        }

        function createInterviewer(recruiterId, user) {
            return $http.post("/api/company/" + recruiterId, user);
        }

        function getInterviewers(recruiterId) {
            return $http.get("/api/company/" + recruiterId);
        }

        function deleteInterviewer(interviewerId) {
            return $http.delete("/api/company/" + interviewerId);
        }

        function getScheduledInterviews(positionId) {
            return $http.get("/api/schedule/interviews/" + positionId);
        }
    }
})();