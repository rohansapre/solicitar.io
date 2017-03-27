(function () {
    angular
        .module("ProjectMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        // /$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
        //$httpProvider.defaults.headers.removeAttr()
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
        //$locationProvider.html5Mode(true);

        $routeProvider
            .when("/login", {

                templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/user/templates/login.view.client.html",
                //templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("default", {

                templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/templates/registers.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/applicant/templates/common.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/user/:uid/editprofile", {
                templateUrl: "views/applicant/templates/editprofile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/recruiter/:uid", {
                templateUrl: "views/recruiter/templates/dash.html",
                controller: "RecruiterController",
                controllerAs: "model"
            })
            .when("/playground", {
                templateUrl: "views/user/templates/registers.view.client.html",
                controller: "playgroundController",
                controllerAs: "model"
            })
            .when("/playground/:pgid", {
                templateUrl: "playground/playground.html",
                controller: "playgroundController",
                controllerAs: "model"
            });

        // $locationProvider.html5Mode(true);
    }
})();