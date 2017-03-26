(function(){
    angular
        .module("ProjectMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            //user routes
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
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "dashboard.html",
                // controller: "ProfileController",
                // controllerAs: "model"
            })
            .when("/playground", {
                templateUrl: "playgound/playground.html"
            });

        // $locationProvider.html5Mode(true);
    }
})();