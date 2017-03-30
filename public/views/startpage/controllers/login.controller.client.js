(function () {
    angular
        .module("ProjectMaker")
        .controller("LoginController", loginController);

    function loginController($rootScope, $location, UserService) {
        // $rootScope.bodyLayout = 'home';
        var vm = this;

        // event handlers
        vm.login = login;
        vm.create = create;

        function init() {
        }

        init();

        function create(user) {
            if (user.password === user.passverify) {
                user.type = 'APPLICANT';
                delete user.passverify;
                UserService.createUser(user)
                    .success(function (user) {
                        if (user) {
                            console.log("Controller user: ");
                            console.log(user);
                            $location.url("/user/" + user._id);
                        }
                        else
                            vm.error = "The user cannot be registered";
                    })
                    .error(function (error) {
                        if (error.statusText.indexOf('duplicate')) {
                            var duplicate = JSON.parse(error.statusText);
                            vm.error = "That " + duplicate.field + " is already taken";
                        }
                    });
            } else
                vm.error = "Passwords do not match";
        }

        function login(user) {
            if (user !== null) {

                var promise = UserService
                    .findUserByCredentials(user.username, user.password);

                promise.success(function(user) {
                    if (user) {
                        if(user.type === 'RECRUITER') {
                            $location.url("/startpage/" + user._id);
                        } else
                            $location.url("/startpage/" + user._id);
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