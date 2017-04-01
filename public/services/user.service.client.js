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
            "findUserByUsername": findUserByUsername,
            "setAvailability": setAvailability,
            "updateAvailability": updateAvailability
        };
        return api;

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/"+userId, newUser);
        }

        function findUserById(userId) {
            return $http.get("/api/user/"+userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username="+username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        // Function used to set the availability of user
        // Pass userID and times object which has the following structure:
        // times = {
        //    start: [startTimes],
        //    end: [endTimes]
        // }
        // startTimes and endTimes are the array of Date objects
        function setAvailability(userId, times) {
            return $http.post("/api/calendar/" + userId, times);
        }

        function updateAvailability(userId, times) {
            return $http.put("/api/calendar/" + userId, times);
        }
    }
})();