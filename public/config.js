(function () {
    angular
        .module("ProjectMaker")
        .config(configuration);

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deffered = $q.defer();
        console.log("reached auth");
        $http.get('api/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                if (user.type === 'ADMIN')
                    $rootScope.adminUser = user;
                else
                    $rootScope.currentUser = user;
                deffered.resolve();
            } else {
                deffered.reject();
                $location.url('/');
            }
        });
        return deffered.promise;
    };

    function configuration($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/login", {
                templateUrl: "views/startpage/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/startpage/templates/login.view.client.html",
                //templateUrl: "views/startpage/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("default", {
                templateUrl: "views/startpage/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/users/common.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/playground", {
                templateUrl: "playground/playground.html",
                controller: "playgroundController",
                controllerAs: "model"
            })
            .when("/admin", {
                templateUrl: "views/admin/templates/admin.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/playground/:pgid", {
                templateUrl: "playground/playground.html",
                controller: "playgroundController",
                controllerAs: "model"
            })
            .when("/user/:uid/interview/:schid",{
                templateUrl: "views/interview/templates/interview.view.client.html",
                controller: "interviewController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/interview", {
                templateUrl: "views/interview/templates/interview.view.client.html",
                controller: "interviewController",
                controllerAs: "model"
            });
    }
})();