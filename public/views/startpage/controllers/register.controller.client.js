(function () {
    angular
        .module("ProjectMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($rootScope, $location, UserService) {
        $rootScope.bodyLayout = 'reg';
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
                                $location.url("/startpage/" + user._id);
                            });

                    });
                // var newUser = UserService.createUser(startpage);
                // if(newUser) {
                //     $location.url("/startpage/"+newUser._id);
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