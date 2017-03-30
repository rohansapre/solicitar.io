(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, UserService) {
        var vm = this;

        // event handlers
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUsers;

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
                    vm.message = "User Successfully Updated!"
                    init();
                } else {
                    vm.error = "Unable to update startpage";
                }
            });
        }

        function deleteUsers() {
            var user = UserService.deleteUser(vm.userId);
            if(user != null) {
                vm.message = "User Successfully Deleted!"
            } else {
                vm.error = "Unable to delete startpage!";
            }
        }
    }
})();