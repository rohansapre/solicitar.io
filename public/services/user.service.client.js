(function () {
    angular
        .module("ProjectMaker")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "createUser": createUser,
            "findUserByCredentials": findUserByCredentials,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "findUserByUsername": findUserByUsername
        };
        return api;

        function createUser(user) {
            var newUser = {
                _id         : +new Date(),
                username    : user.username,
                password    : user.password,
                firstName   : user.firstname,
                lastName    : user.lastname,
                email       : user.email
            };
            return $http.post("/api/startpage", newUser);

        }

        function updateUser(userId, newUser) {
            return $http.put("/api/startpage/"+userId, newUser);

        }

        function findUserById(userId) {
            console.log('was in startpage.service.client.js');
            return $http.get("/api/startpage/"+userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/startpage?username="+username);
        }

        function findUserByCredentials(username, password) {
            console.log(username);
            return $http.get("/api/startpage?username="+username+"&password="+password);
        }

        function deleteUser(userId) {
            return $http.delete("/api/startpage/" + userId);
        }
    }
})();