/**
 * Created by rohansapre on 4/6/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("InterviewService", interviewService);

    function interviewService($http) {
        
        var api = {
            "getUpcomingInterviewPositions": getUpcomingInterviewPositions
        };
        return api;
        
        function getUpcomingInterviewPositions(interviewerId) {
            return $http.get("/api/schedule/" + interviewerId);
        }
    }

})();