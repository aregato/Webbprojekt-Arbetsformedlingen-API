console.log("loaded");
var module = angular.module("AnnonsApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
        url: "/"
    });
});

module.controller("annonsCtrl", function ($scope, $http) {
    var nyckelord = "programmerare";
    var url = "http://api.arbetsformedlingen.se/platsannons/matchning?nyckelord=" + nyckelord;

    /*$.ajax({
     type: 'GET',
     url: 'http://api.arbetsformedlingen.se/platsannons/matchning?nyckelord=programmerare',
     contentType: 'application/json',
     xhrFields: {
     withCredentials: false
     },
     headers: {
     "Accept": "application/json",
     "Accept-Language": "sv",
     "From": "daniel.lundberg@utb.vaxjo.se"
     },
     success: function () {
     console.log("success");
     },
     error: function () {
     console.log("fail");
     }
     });*/
    $http.get(url).success(function (data) {
        $scope.data = data;
        console.log(data);
    });
});
