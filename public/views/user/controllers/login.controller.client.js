(function () {
    angular
        .module("ProjectMaker")
        .controller("LoginController", loginController);

    function loginController($rootScope, $location, UserService) {
        $rootScope.bodyLayout = 'home';
        var vm = this;

        // event handlers
        vm.login = login;
        vm.create = create;

        function init() {
        }

        init();

        function create(user) {
            console.log(user);
            if (user.password==user.passverify) {
                user.type = 'APPLICANT';
                UserService
                    .findUserByUsername(user.username)
                    .success(function(user) {
                        vm.error = "That username is already taken";
                    })
                    .error(function(err){
                        vm.message = "Available";
                        var promise = UserService.createUser(user);
                        promise
                            .success(function (user) {
                                $location.url("/user/" + user._id);
                            });

                    });
                // var newUser = UserService.createUser(user);
                // if(newUser) {
                //     $location.url("/user/"+newUser._id);
                // }
                // else {
                //     vm.error = "User cannot be created";
                // }
            }
            else {
                vm.error = "Passwords do not match"
            }
        }

        function login(user) {
            if (user != null) {

                var promise = UserService
                    .findUserByCredentials(user.username, user.password);

                promise.success(function(user) {
                    if (user) {
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