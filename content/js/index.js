//Committa

var module = angular.module("AnnonsApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
        url: "/"
    });
});
var test;
module.controller("annonsCtrl", function ($scope, getService) {
    $scope.nyckelord = "";
    $scope.dropdownlan = "";
    $scope.dropdownkommun = "";
    $scope.sida = 1;
    //Skaffa län, ingen indata behövs
    var promiseLan = getService.getLan();
    promiseLan.then(function (data) {
        $scope.lan = data.soklista.sokdata;
    });
    //Söker efter "a" i alla län och kommuner (kan inte söka tomt)
    $scope.sistasokning = ["a","",""];
    var promiseSok = getService.getSearch("a", "", "", "1");
    promiseSok.then(function (data) {
        $scope.annonser = data.matchningslista.matchningdata;
        console.log($scope.annonser[0].annonsid);
    });
    //Tar sökningen, länet och kommunen, endast ett fält behöver vara ifyllt
    //sparar sökningen i $scope.sistasokning
    $scope.sok = function () {
        $scope.sida = 1;
        var nyckelord = "" + $scope.nyckelord;
        var lanid = "" + $scope.dropdownlan;
        var kommunid = "" + $scope.dropdownkommun;
        var sida = "" + $scope.sida;
        $scope.sistasokning = [nyckelord, lanid, kommunid];
        promiseSok = getService.getSearch(nyckelord, lanid, kommunid, sida);
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
    //tar de sparade värdena och ökar sidnummret med 1
    //lägger sen till resultatet till $scope.annonser
    $scope.visaMer = function () {
        var nyckelord = $scope.sistasokning[0];
        var lanid = $scope.sistasokning[1];
        var kommunid = $scope.sistasokning[2];
        $scope.sida++;
        var sida = "" + $scope.sida;
        promiseSok = getService.getSearch(nyckelord, lanid, kommunid, sida);
        promiseSok.then(function (data) {
            $scope.annonser = $scope.annonser.concat(data.matchningslista.matchningdata);

        });
    };
    //tar bort tid från datum och behåller bara dag månad och år
    $scope.datum = function (datum) {
        return datum.split("T")[0];
    };
});

module.service("getService", function ($http, $q) {
    this.getSearch = function (nyckelord, lanid, kommunid, sida) {
        var proxy = "https://jsonp.afeld.me/?url=";
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var sokMetod = "matchning";
        var query = "?nyckelord=" + nyckelord;
        query += "&lanid=" + lanid;
        query += "&kommunid=" + kommunid;
        query += "&sida=" + sida;
        var deferred = $q.defer();
        $http.get(proxy + encodeURIComponent(basurl + sokMetod + query))
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
        var proxy = "https://jsonp.afeld.me/?url=";
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var lanMetod = "soklista/lan";
        var deferred = $q.defer();
        $http.get(proxy + encodeURIComponent(basurl + lanMetod))
                .success(function (data, status) {
                    console.log(status);
                    deferred.resolve(data);
                }).error(function (data, status) {
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getKommuner = function (lanid) {
        var proxy = "https://jsonp.afeld.me/?url=";
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var kommunMetod = "soklista/kommuner";
        var query = "?lanid=" + lanid;
        var deferred = $q.defer();
        $http.get(proxy + encodeURIComponent(basurl + kommunMetod + query))
                .success(function (data, status) {
                    console.log(status);
                    deferred.resolve(data);
                }).error(function (data, status) {
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getAnnons = function (annonsid) {
        var proxy = "https://jsonp.afeld.me/?url=";
        var basurl = "http://api.arbetsformedlingen.se/platsannons/";
        var annonsid = annonsid;
        var deferred = $q.defer();
        $http.get(proxy + encodeURIComponent(basurl + annonsid))
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
