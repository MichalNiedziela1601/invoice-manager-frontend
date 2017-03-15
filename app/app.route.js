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
            templateUrl: 'modules/invoices/list/invoices.tpl.html', controller: 'InvoicesController', controllerAs: 'invoicesCtrl'
        });

        $routeProvider.when('/invoice', {
            templateUrl: 'modules/invoices/add/addInvoice.tpl.html',
            controller: 'AddInvoiceController',
            controllerAs: 'addInvoiceCtrl',
            css: 'modules/invoices/add/addInvoice.css'

        }).otherwise({redirectTo: '/'});
    }

    angular.module('app').config(config);

})();
