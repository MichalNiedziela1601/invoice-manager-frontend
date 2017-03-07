(function ()
{
    'use strict';

    function config($routeProvider)
    {
        $routeProvider.when('/', {
            templateUrl: 'modules/start/start.tpl.html', controller: 'StartController', controllerAs: 'startCtrl'
        });
        $routeProvider.when('/contractors', {
            templateUrl: 'modules/contractors/contractors.tpl.html', controller: 'ContractorsController', controllerAs: 'contractorsCtrl'
        }).otherwise({redirectTo: '/'});
    }

    angular.module('app').config(config);

})();
