describe('Routes', function ()
{
    'use strict';

    var route;

    beforeEach(function ()
    {
        module('app');
        inject(function ($route)
        {
            route = $route;
        });
    });

    describe('/', function ()
    {
        it('should has \'StartController\' controller ', function ()
        {
            expect(route.routes['/'].controller).toBe('StartController');

        });
        it('should has \'modules/start/start.tpl.html\' template ', function ()
        {
            expect(route.routes['/'].templateUrl).toBe('modules/start/start.tpl.html');
        });
        it('should has \'startCtrl\' as controller shortcut', function ()
        {
            expect(route.routes['/'].controllerAs).toBe('startCtrl');
        });
    });
    describe('/login', function ()
    {
        it('should has \'LoginController\' controller ', function ()
        {
            expect(route.routes['/login'].controller).toBe('LoginController');
        });
        it('should has \'login.html\' template ', function ()
        {
            expect(route.routes['/login'].templateUrl).toBe('modules/login/login.tpl.html');
        });
        it('should has \'login\' as controller shortcut', function ()
        {
            expect(route.routes['/login'].controllerAs).toBe('loginCtrl');
        });
    });
    describe('/contractors', function ()
    {
        it('should has \'ContractorsController\' controller ', function ()
        {
            expect(route.routes['/contractors'].controller).toBe('ContractorsController');
        });
        it('should has \'contractors.html\' template ', function ()
        {
            expect(route.routes['/contractors'].templateUrl).toBe('modules/contractors/listView/contractors.tpl.html');
        });
        it('should has \'contractors\' as controller shortcut', function ()
        {
            expect(route.routes['/contractors'].controllerAs).toBe('contractorsCtrl');
        });
    });
    describe('/add/contractors', function ()
    {
        it('should has \'BuyCtrl\' controller ', function ()
        {
            expect(route.routes['/add/contractors'].controller).toBe('AddContractorsController');
        });
        it('should has \'add/contractors.html\' template ', function ()
        {
            expect(route.routes['/add/contractors'].templateUrl).toBe('/modules/contractors/add/addContractors.tpl.html');
        });
        it('should has \'add/contractors.html\' as controller shortcut', function ()
        {
            expect(route.routes['/add/contractors'].controllerAs).toBe('addContractorsCtrl');
        });
    });
    describe('/invoices', function ()
    {
        it('should has \'invoices\' controller ', function ()
        {
            expect(route.routes['/invoices'].controller).toBe('InvoicesController');
        });
        it('should has \'invoices.html\' template ', function ()
        {
            expect(route.routes['/invoices'].templateUrl).toBe('modules/invoices/list/invoices.tpl.html');
        });
        it('should has \'invoices\' as controller shortcut', function ()
        {
            expect(route.routes['/invoices'].controllerAs).toBe('invoicesCtrl');
        });
        it('should has \'invoices\' as css ', function ()
        {
            expect(route.routes['/invoices'].css).toBe('/modules/invoices/list/invoices.css');
        });
    });
    describe('/invoices/invoicesDetails/:id', function ()
    {
        it('should has \'invoices/details/:id\' controller ', function ()
        {
            expect(route.routes['/invoices/details/:id'].controller).toBe('InvoiceDetailsController');
        });
        it('should has \'details.html\' template ', function ()
        {
            expect(route.routes['/invoices/details/:id'].templateUrl).toBe('/modules/invoices/details/invoiceDetails.tpl.html');
        });
        it('should has \'invoices/details/:id\' as controller shortcut', function ()
        {
            expect(route.routes['/invoices/details/:id'].controllerAs).toBe('invoiceDetailsCtrl');
        });
    });
    describe('/registration', function ()
    {
        it('should has \'registration\' controller ', function ()
        {
            expect(route.routes['/registration'].controller).toBe('RegistrationCompanyController');
        });
        it('should has \'registration.html\' template ', function ()
        {
            expect(route.routes['/registration'].templateUrl).toBe('modules/registration/registrationCompany.tpl.html');
        });
        it('should has \'registration\' as controller shortcut', function ()
        {
            expect(route.routes['/registration'].controllerAs).toBe('registrationCompanyCtrl');
        });
        it('should has \'registration\' as css', function ()
        {
            expect(route.routes['/registration'].css).toBe('/modules/registration/registrationCompany.css');
        });
    });
    describe('/user', function ()
    {
        it('should has \'user\' controller ', function ()
        {
            expect(route.routes['/user'].controller).toBe('UserController');
        });
        it('should has \'user.html\' template ', function ()
        {
            expect(route.routes['/user'].templateUrl).toBe('modules/user/user.tpl.html');
        });
        it('should has \'user\' as controller shortcut', function ()
        {
            expect(route.routes['/user'].controllerAs).toBe('userCtrl');
        });
    });
    describe('/add/invoice', function ()
    {
        it('should has \'addInvoice\' controller ', function ()
        {
            expect(route.routes['/add/invoice/upload'].controller).toBe('UploadInvoiceController');
        });
        it('should has \'uploadInvoice.html\' template ', function ()
        {
            expect(route.routes['/add/invoice/upload'].templateUrl).toBe('/modules/invoices/add/upload/uploadInvoice.tpl.html');
        });
        it('should has \'uploadInvoice\' as controller shortcut', function ()
        {
            expect(route.routes['/add/invoice/upload'].controllerAs).toBe('uploadInvoiceCtrl');
        });
    });
    describe('otherwise', function ()
    {
        it('should redirect to /', function ()
        {
            expect(route.routes[null].redirectTo).toEqual('/');
        });
    });
});
