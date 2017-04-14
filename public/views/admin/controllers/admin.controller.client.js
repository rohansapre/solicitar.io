/**
 * Created by rohansapre on 4/14/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .controller("AdminController", AdminController);

    function AdminController(AdminService, $location) {
        var vm = this;

        vm.getRecruiters = getRecruiters;
        vm.getApplicants = getApplicants;
        vm.getInterviewers = getInterviewers;
        vm.addRecruiter = addRecruiter;
        vm.addApplicant = addApplicant;
        vm.addInterviewer = addInterviewer;
        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;
        vm.becomeUser = becomeUser;

        function init() {

        }
        init();

        function getRecruiters() {
            AdminService.getRecruiters()
                .success(function (users) {
                    console.log(users);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function getApplicants() {
            AdminService.getApplicants()
                .success(function (users) {
                    console.log(users);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function getInterviewers() {
            AdminService.getInterviewers()
                .success(function (users) {
                    console.log(users);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function addRecruiter(recruiter) {
            recruiter.type = 'RECRUITER';
            AdminService.createUser(recruiter)
                .success(function (recruiter) {
                    console.log(recruiter);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function addApplicant(applicant) {
            applicant.type = 'APPLICANT';
            AdminService.createUser(applicant)
                .success(function (applicant) {
                    console.log(applicant);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function addInterviewer(interviewer) {
            interviewer.type = 'INTERVIEWER';
            AdminService.createUser(interviewer)
                .success(function (interviewer) {
                    console.log(interviewer);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function deleteUser(userId) {
            AdminService.deleteUser(userId)
                .success(function (user) {
                    console.log(user);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function updateUser(userId, user) {
            AdminService.updateUser(userId, user)
                .success(function (user) {
                    console.log(user);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function becomeUser(userId) {
            $location.url("/user/" + userId);
        }
    }
})();