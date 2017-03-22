(function () {
    angular
        .module("ProjectMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;

        // event handlers
        vm.create = create;

        function init() {
        }
        init();

        function create(user) {
            console.log(user);
            if (user.password==user.passverify) {
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
    }
})();