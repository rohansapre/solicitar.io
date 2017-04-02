(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, UserService, RecruiterService) {
        var vm = this;

        // event handlers
        vm.interview = interview;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUsers;
        vm.sendInvitations = sendInvitations;

        function init() {
            vm.userId = $routeParams['uid'];
            var promise = UserService.findUserById(vm.userId);
            promise.success(function(user) {
                vm.user = user;
                vm.name = user.firstName + " " + user.lastName;
            });

        }
        init();

        function updateUser(newUser) {
            UserService
                .updateUser(vm.userId, newUser)
                .success(function (user) {
                if(user != null) {
                    vm.message = "User Successfully Updated!";
                    init();
                } else {
                    vm.error = "Unable to update user";
                }
            });
        }

        function deleteUsers() {
            var user = UserService.deleteUser(vm.userId);
            if(user != null) {
                vm.message = "User Successfully Deleted!"
            } else {
                vm.error = "Unable to delete user!";
            }
        }

        function sendInvitations() {
            var emails = ['mht.amul@gmail.com', 'chaitanyakaul2001@gmail.com', 'tushar.gupta.cse@gmail.com', '11bit028@nirmauni.ac.in'];
            console.log("send invites");
            RecruiterService.sendInvitations(emails)
                .success(function (status) {
                    if(status) {
                        console.log("Invitation sent from controller");
                        console.log(status);
                    } else
                        console.log("Cannot send invitation from controller");
                });
        }

        function interview() {
                $location.url("/user/" + vm.user._id + "/interview/");
        }
    }
})();