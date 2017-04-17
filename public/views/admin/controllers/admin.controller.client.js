    /**
 * Created by rohansapre on 4/14/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .controller("AdminController", AdminController);

    function AdminController(AdminService, UserService, $location, $rootScope) {
        var vm = this;

        vm.getRecruiters = getRecruiters;
        vm.getApplicants = getApplicants;
        vm.getInterviewers = getInterviewers;
        vm.addRecruiter = addRecruiter;
        vm.addApplicant = addApplicant;
        vm.addInterviewer = addInterviewer;
        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;
        vm.becomeGod = becomeGod;
        vm.logout = logout;

        function init() {
            console.log("in admin");
            console.log($rootScope.currentUser);
        }
        init();

        function getRecruiters() {
            AdminService.getRecruiters()
                .success(function (users) {
                    vm.whatever = users;
                    vm.selectRecruiter = users;
                    console.log(users);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function getApplicants() {
            AdminService.getApplicants()
                .success(function (users) {
                    vm.whatever = users;
                    console.log(users);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function getInterviewers() {
            AdminService.getInterviewers()
                .success(function (users) {
                    vm.whatever = users;
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

        function addInterviewer(recruiterId, interviewer) {
            interviewer.type = 'INTERVIEWER';
            interviewer._recruiter = recruiterId;
            AdminService.createUser(interviewer)
                .success(function (interviewer) {
                    console.log(interviewer);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function deleteUser(userId) {
            vm.currentUser =
            AdminService.deleteUser(userId)
                .success(function (user) {
                    console.log(user);
                    if (vm.now=='RECRUITER') {
                        getRecruiters();
                    }
                    if (vm.now=='APPLICANT') {
                        getApplicants();
                    }
                    if (vm.now=='INTERVIEWER') {
                        getInterviewers();
                    }
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

        function becomeGod(user) {
            $rootScope.currentUser = user;
            $location.url("/user/" + user._id);
        }

        function logout() {
            console.log("reached logout");
            UserService.logout()
                .then(function (response) {
                    console.log("reached back");
                    $rootScope.adminUser = null;
                    $location.url("/");
                });
        }
    }
})();