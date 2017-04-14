/**
 * Created by rohansapre on 4/14/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .factory("AdminService", adminService);

    function adminService($http) {
        var api = {
            "getRecruiters": getRecruiters,
            "getApplicants": getApplicants,
            "getInterviewers": getInterviewers,
            "createUser": createUser,
            "deleteUser": deleteUser,
            "updateUser": updateUser
        };
        return api;

        function getRecruiters() {
            return $http.get("/api/admin/users/" + 'RECRUITER');
        }

        function getApplicants() {
            return $http.get("/api/admin/users/" + 'APPLICANT');
        }

        function getInterviewers() {
            return $http.get("/api/admin/users/" + 'INTERVIEWER');
        }

        function createUser(user) {
            return $http.post("/api/admins/user", user);
        }

        function deleteUser(userId) {
            return $http.delete("/api/admin/user/" + userId);
        }

        function updateUser(userId, user) {
            return $http.put("/api/admin/user/" + userId, user);
        }
    }
})();