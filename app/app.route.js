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
        });
        $routeProvider.when('/invoices', {
            templateUrl: 'modules/invoices/list.tpl.html', controller: 'ListController', controllerAs: 'listCtrl'
        }).otherwise({redirectTo: '/'});
    }

    angular.module('app').config(config);

})();
