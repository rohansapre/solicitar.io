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
                UserService.register(user)
                    .success(function (user) {
                        if (user.message != null) {
                            vm.error = user.message;
                        } else if (user) {
                            $location.url("/user/" + user._id);
                        }
                    })
                    .error(function (error) {
                        console.log(error);
                        if (error.statusText.indexOf('duplicate') > -1) {
                            var duplicate = JSON.parse(error.statusText);
                            vm.error = "That " + duplicate.field + " is already taken";
                        } else if (error.statusText.indexOf("can't register") > -1) {
                            var problem = JSON.parse(error);
                            vm.error = problem.message;
                        }
                    });
            } else
                vm.error = "Passwords do not match";
        }

        function login(user) {
            console.log(user);
            if (user !== null) {
                if (user.username == "admin" && user.password == 'admin') {
                    console.log('God Mode');
                    $location.url("/admin");
                }
                UserService.login(user)
                    .success(function(user) {
                    if (user) {
                        $rootScope.currentUser = user;
                        if(user.type === 'RECRUITER') {
                            $location.url("/user/" + user._id);
                        } else
                            $location.url("/user/" + user._id);
                    }

                })
                    .error(function(error) {
                        if (error === 'Unauthorized') {
                            vm.error = "User not found!";
                            user.username = "";
                            user.password = "";
                        }
                    });
            } else
                vm.error = "Please enter details!"
        }
    }
})();