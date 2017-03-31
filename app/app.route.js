(function ()
{
    'use strict';

    function config($routeProvider)
    {
        $routeProvider.when('/', {
            templateUrl: 'modules/start/start.tpl.html', controller: 'StartController', controllerAs: 'startCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'modules/login/login.tpl.html', controller: 'LoginController', controllerAs: 'loginCtrl'
        });

        $routeProvider.when('/contractors', {
            templateUrl: 'modules/contractors/listView/contractors.tpl.html', controller: 'ContractorsController', controllerAs: 'contractorsCtrl'
        });

        $routeProvider.when('/add/contractors', {
            templateUrl: '/modules/contractors/add/addContractors.tpl.html',
            controller: 'AddContractorsController',
            controllerAs: 'addContractorsCtrl'
        });

        $routeProvider.when('/invoices', {
            templateUrl: 'modules/invoices/list/invoices.tpl.html',
            controller: 'InvoicesController',
            controllerAs: 'invoicesCtrl',
            css: '/modules/invoices/list/invoices.css'
        });
        $routeProvider.when('/invoices/details/:id', {
            templateUrl: '/modules/invoices/details/invoiceDetails.tpl.html', controller: 'InvoiceDetailsController', controllerAs: 'InvoiceDetailsCtrl'
        });

        $routeProvider.when('/registration', {
            templateUrl: 'modules/registration/registrationCompany.tpl.html',
            controller: 'RegistrationCompanyController',
            controllerAs: 'registrationCompanyCtrl',
            css: '/modules/registration/registrationCompany.css'
        });

        $routeProvider.when('/user', {
            templateUrl: 'modules/user/user.tpl.html', controller: 'UserController', controllerAs: 'userCtrl'
        });

        $routeProvider.when('/add/invoice', {
            templateUrl: '/modules/invoices/add/addInvoice.tpl.html',
            controller: 'AddInvoiceController',
            controllerAs: 'addInvoiceCtrl',
            css: '/modules/invoices/add/addInvoice.css'

        }).otherwise({redirectTo: '/'});
    }

    angular.module('app').config(config);

})();
