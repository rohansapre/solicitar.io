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
            "getCandidatesForUpcomingPositions": getCandidatesForUpcomingPositions,
            "getCandiatesForPastPositions": getCandidatesForPastPositions,
            "updateInterviewTime": updateInterviewTime,
            "assignInterviewer": assignInterviewer,
            "getInterviewerSchedule": getInterviewerSchedule,
            "getNextInterviewForInterviewer": getNextInterviewForInterviewer,
            "getNextInterviewForApplicant": getNextInterviewForApplicant
        };
        return api;
        
        function getUpcomingInterviewPositions(interviewerId) {
            return $http.get("/api/schedule/upcoming/" + interviewerId);
        }

        function getPastInterviewPositions(interviewerId) {
            return $http.get("/api/schedule/past/" + interviewerId);
        }

        function getCandidatesForUpcomingPositions(interviewerId, positionId) {
            return $http.get("/api/schedule/upcoming/" + interviewerId + "/position/" + positionId);
        }

        function getCandidatesForPastPositions(interviewerId, positionId) {
            return $http.get("/api/schedule/past/" + interviewerId + "/position/" + positionId);
        }

        //  Schedule Interview
        // hire = {
        //     _recruiter: recruiterId,
        //     position: position
        // }

        function updateInterviewTime(interviewId, time) {
            return $http.put("/api/schedule/" + interviewId, time);
        }

        function assignInterviewer(users) {
            return $http.post("/api/schedule", users);
        }

        function getInterviewerSchedule(interviewerId) {
            return $http.get("/api/schedule/" + interviewerId);
        }

        function getNextInterviewForInterviewer(interviewerId) {
            return $http.get("/api/schedule/interviewer/next/" + interviewerId);
        }
        
        function getNextInterviewForApplicant(applicantId) {
            return $http.get("/api/schedule/applicant/next/" + applicantId);
        }
    }

})();