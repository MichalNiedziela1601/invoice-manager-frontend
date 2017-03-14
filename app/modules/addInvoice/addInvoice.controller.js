(function ()
{
    'use strict';

    function AddInvoiceController(Invoice)
    {
        var ctrl = this;
        ctrl.transationType = null;
        ctrl.showAddInvoice = false;
        ctrl.showCreateCompany = false;
        ctrl.invoiceCompany = {};
        ctrl.invoicePerson = {};
        ctrl.companyDetails = {};

        ctrl.create = {
            opened: false
        };

        ctrl.expire = {
            opened: false
        };

        ctrl.format = 'dd-MMMM-yyyy';

        ctrl.dateOptionsCreate = {
            formatYear: 'yy',
            maxDate: new Date(),
            startingDay: 1
        };

        ctrl.dateOptionsExpire = {
            formatYear: 'yy',
            startingDay: 1
        };


        ////////////////////////////
        function todayCreate()
        {
            ctrl.createDate = new Date();
        }

        function todayExpire()
        {
            ctrl.expireDate = new Date();
        }

        function clearCreate()
        {
            ctrl.createDate = null;
        }

        function clearExpire()
        {
            ctrl.expireDate = null;
        }

        function openCreate()
        {
            ctrl.create.opened = true;
        }

        function openExpire()
        {
            ctrl.expire.opened = true;
        }

        function addInvoiceCompany()
        {
            ctrl.invoiceCompany.type = ctrl.transationType;
            ctrl.invoiceCompany.createDate = ctrl.createDate.toISOString().slice(0, 10);
            ctrl.invoiceCompany.executionEndDate = ctrl.expireDate.toISOString().slice(0, 10);
            Invoice.add(ctrl.invoiceCompany).then(function(){

            });
        }

        function addInvoicePerson()
        {
            ctrl.invoicePerson.createDate = ctrl.createDate.toISOString().slice(0, 10);
            ctrl.invoicePerson.executionEndDate = ctrl.expireDate.toISOString().slice(0, 10);
        }

        function toggleShowCreateCompany(){
            ctrl.showCreateCompany = !ctrl.showCreateCompany;
        }

        function init()
        {
            todayCreate();
            todayExpire();
        }

        function findContractor(){

        }

        ////////////////////////////////////

        init();

        ctrl.todayCreate = todayCreate;
        ctrl.todayExpire = todayExpire;
        ctrl.clearCreate = clearCreate;
        ctrl.clearExpire = clearExpire;
        ctrl.openCreate = openCreate;
        ctrl.openExpire = openExpire;
        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.addInvoicePerson = addInvoicePerson;
        ctrl.findContractor = findContractor;
        ctrl.toggleShowCreateCompany = toggleShowCreateCompany;
    }

    angular.module('app')
            .controller('AddInvoiceController', ['Invoice',AddInvoiceController]);


})();
