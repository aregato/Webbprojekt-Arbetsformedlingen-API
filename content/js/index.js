var module = angular.module("AnnonsApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
        url: "/"
    });
});
var test;
module.controller("annonsCtrl", function ($scope, getService) {
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

    var promiseLan = getService.getLan();
    promiseLan.then(function (data) {
        $scope.lan = data;
        console.log(data);
    });

    var promiseSok = getService.getSearch("a", "", "");
    promiseSok.then(function (data) {
        $scope.annonser = data.matchningslista.matchningdata;
        test = data;
        console.log("vvvvvvvvvvvvv");
        console.log($scope.annonser);
        console.log("^^^^^^^^^^^^");
    });

    $scope.sok = function () {
        var nyckelord = "" + $scope.nyckelord;
        var lanid = "" + $scope.lanid;
        var kommunid = "" + $scope.kommunid;
        promiseSok = getService.getSearch(nyckelord, lanid, kommunid);
    };
    $scope.getKommuner = function () {
        var lanid = "" + $scope.lanid;
        promiseKommuner = getService.getKommuner(lanid);
    };
    $scope.datum = function(skitdatum){
        var datum = skitdatum.split("T")[0];
        return datum;
    };
});

module.service("getService", function ($http, $q) {
    this.getSearch = function (nyckelord, lanid, kommunid) {
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var sokMetod = "matchning";
        var query = "?nyckelord=" + nyckelord;
        query += "&lanid=" + lanid;
        query += "&kommunid" + kommunid;
        var deferred = $q.defer();
        $http.get(basurl + sokMetod + query)
                .success(function (data, status) {
                    console.log(status);
                    deferred.resolve(data);
                }).error(function (data, status) {
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getLan = function () {
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var lanMetod = "soklista/lan";
        var deferred = $q.defer();
        $http.get(basurl + lanMetod)
                .success(function (data, status) {
                    console.log(status);
                    deferred.resolve(data);
                }).error(function (data, status) {
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getKommuner = function (lanid)
    {
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var kommunMetod = "soklista/kommuner";
        var query = "?lanid=" + lanid;
        var deferred = $q.defer();
        $http.get(basurl + kommunMetod + query)
                .success(function (data, status) {
                    console.log(status);
                    deferred.resolve(data);
                }).error(function (data, status) {
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };
});
