/**
 * Created by rohansapre on 4/6/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("InterviewService", interviewService);

    function interviewService($http) {
        
        var api = {
            "getUpcomingInterviewPositions": getUpcomingInterviewPositions,
            "getPastInterviewPositions": getPastInterviewPositions,
            "getCandidatesForPosition": getCandidatesForPosition,
            "updateInterviewTime": updateInterviewTime
        };
        return api;
        
        function getUpcomingInterviewPositions(interviewerId) {
            return $http.get("/api/schedule/upcoming/" + interviewerId);
        }

        function getPastInterviewPositions(interviewerId) {
            return $http.get("/api/schedule/past/" + interviewerId);
        }

        function getCandidatesForPosition(interviewerId, positionId) {
            return $http.get("/api/schedule/" + interviewerId + "/position/" + positionId);
        }

        //  Schedule Interview
        // hire = {
        //     _recruiter: recruiterId,
        //     position: position
        // }

        function updateInterviewTime(interviewId, time) {
            return $http.put("/api/schedule/" + interviewId, time);
        }
    }

})();