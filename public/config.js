(function () {
    angular
        .module("ProjectMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        // /$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
        //$httpProvider.defaults.headers.removeAttr()
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
                controllerAs: "model"
            })
            .when("/playground", {
                templateUrl: "playground/playground.html",
                controller: "playgroundController",
                controllerAs: "model"
            })
            .when("/playground/:pgid", {
                templateUrl: "playground/playground.html",
                controller: "playgroundController",
                controllerAs: "model"
            })
            .when("/user/:uid/interview/:pgid",{
                templateUrl: "views/interview/templates/interview.view.client.html",
                controller: "interviewController",
                controllerAs: "model"
            })
            .when("/user/:uid/interview", {
                templateUrl: "views/interview/templates/interview.view.client.html",
                controller: "interviewController",
                controllerAs: "model"
            });
    }
})();