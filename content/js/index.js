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
    $scope.nyckelord = "";
    $scope.dropdownlan = "";
    $scope.dropdownkommun = "";
    //Skaffa län, ingen indata behövs
    var promiseLan = getService.getLan();
    promiseLan.then(function (data) {
        $scope.lan = data.soklista.sokdata;
    });
    //Söker efter "a" i alla län och kommuner (kan inte söka tomt)
    var promiseSok = getService.getSearch("a", "", "");
    promiseSok.then(function (data) {
        $scope.annonser = data.matchningslista.matchningdata;
        console.log($scope.annonser[0].annonsid);
    });
    //Tar sökningen, länet och kommunen, endast ett fält behöver vara ifyllt
    $scope.sok = function () {
        var nyckelord = "" + $scope.nyckelord;
        var lanid = "" + $scope.dropdownlan;
        var kommunid = "" + $scope.dropdownkommun;
        promiseSok = getService.getSearch(nyckelord, lanid, kommunid);
        promiseSok.then(function (data) {
            $scope.annonser = data.matchningslista.matchningdata;
        });
    };
    //tar län id och skaffar alla kommuner i länet
    $scope.getKommuner = function () {
        var lanid = $scope.dropdownlan;
        var promiseKommuner = getService.getKommuner(lanid);
        promiseKommuner.then(function (data) {
            $scope.kommuner = data.soklista.sokdata;
        });
    };
    //Får annons id från knappen och skickar det
    $scope.getAnnons = function (annonsid) {
        annonsid = "" + annonsid;
        promiseAnnons = getService.getAnnons(annonsid);
        promiseAnnons.then(function (data) {
            $scope.annons = data.platsannons.annons;
            $("#popupDiv").html($scope.annons.annonstext);
        });
    };
    //tar bort tid från datum och behåller bara dag månad och år
    $scope.datum = function (datum) {
        return datum.split("T")[0];
    };
});

module.service("getService", function ($http, $q) {
    this.getSearch = function (nyckelord, lanid, kommunid) {
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var sokMetod = "matchning";
        var query = "?nyckelord=" + nyckelord;
        query += "&lanid=" + lanid;
        query += "&kommunid=" + kommunid;
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

    this.getAnnons = function (annonsid)
    {
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var annonsid = annonsid;
        var deferred = $q.defer();
        $http.get(basurl + annonsid)
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
