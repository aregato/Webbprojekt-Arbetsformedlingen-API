console.log("loaded");
var module = angular.module("AnnonsApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
        url: "/"
    });
});

module.controller("annonsCtrl", function ($scope, $http) {
    var basurl = "http://api.arbetsformedlingen.se/platsannons/";
    var query = "nyckelord=programmerare";
    var sokMetod = "matchning?";
    var lanMetod = "soklista/lan";

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
    $http.get(basurl+sokMetod+query).success(function (data) {
        $scope.annonser = data;
        console.log(data);
    });
    $http.get(basurl+lanMetod).success(function (data) {
        $scope.lan = data;
        console.log(data);
    });
});
// comment