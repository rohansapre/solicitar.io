/**
 * Created by rohansapre on 3/25/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .controller("RecruiterController", recruiterController);

    function recruiterController($location, RecruiterService) {
        var vm = this;

        // event handlers
        vm.sendInvitations = sendInvitations;

        function init() {
        }

        init();

        function sendInvitations() {
            var emails = ['abc@def.com', 'ghi@jkl.com', 'mno@pqr.com'];
            console.log("send invites");
            RecruiterService.sendInvitations(emails)
                .success(function (status) {
                    if(status) {
                        console.log("Invitation sent from controller");
                    } else
                        console.log("Cannot send invitation from controller");
                });
        }

        function login(user) {
            if (user != null) {

                var promise = UserService
                    .findUserByCredentials(user.username, user.password);

                promise.success(function(user) {
                    if (user) {
                        if(user.type === 'RECRUITER') {
                            $location.url("/recruiter/" + user._id);
                        } else
                            $location.url("/user/" + user._id);
                    }
                    else {
                        vm.error = "User not found!";
                    }
                });
            }

            else {
                vm.error = "Please enter details!"
            }
        }
    }
})();