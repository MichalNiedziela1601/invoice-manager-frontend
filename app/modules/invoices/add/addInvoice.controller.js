(function ()
{
    'use strict';

    function AddInvoiceController(InvoiceDAO, CompanyDAO, $uibModal)
    {
        var ctrl = this;
        ctrl.transationType = null;
        ctrl.showAddInvoice = false;
        ctrl.nipContractor = null;
        ctrl.invoiceCompany = {};
        ctrl.invoicePerson = {};
        ctrl.companyDetails = {};

        ctrl.createDatePicker = {
            date: new Date(), opened: false, options: {
                formatYear: 'yy', maxDate: new Date(), startingDay: 1
            }, open: function ()
            {
                this.opened = !this.opened;
            }
        };

        ctrl.executionDatePicker = {
            date: new Date(), opened: false, options: {
                formatYear: 'yy', startingDay: 1
            }, open: function ()
            {
                this.opened = !this.opened;
            }
        };

        ////////////////////////////

        function addInvoiceCompany()
        {
            ctrl.invoiceCompany.type = ctrl.transationType;
            ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
            ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
            InvoiceDAO.add(ctrl.invoiceCompany).then(function ()
            {

            });
        }

        function addInvoicePerson()
        {
            ctrl.invoicePerson.type = ctrl.transationType;
            ctrl.invoicePerson.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
            ctrl.invoicePerson.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
        }

        function findContractor()
        {
            CompanyDAO.findByNip(ctrl.nipContractor).then(function (result)
            {
                ctrl.showBox = true;
                ctrl.showAlert = false;
                ctrl.companyDetails = result;
            }).catch(function ()
            {
                ctrl.showAlert = true;
                ctrl.showBox = false;

            });
        }

        // mocked company
        ctrl.mockedCompany = {
            name: 'Fajna firma', nip: 999999999, regon: 99999, street: 'Zamojskiego', buildNr: '70', flatNr: '20', postCode: '22-400', city: 'Zamosc'
        };


        ctrl.openAddCompanyModal = function (size)
        {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/invoices/add/addCompanyModal/addCompanyModal.tpl.html',
                controller: 'AddCompanyModalController',
                controllerAs: 'addCompModalCtrl',
                backdrop: 'static',
                size: size,
                resolve: {
                    companyDetails: function ()
                    {
                        return ctrl.companyDetails;
                    }
                }
            });

            modalInstance.result.then(function (compDetails)
            {
                ctrl.companyDetails = compDetails;
            }, function ()
            {

            });
        };

        // modal function
        ctrl.open = function (size, items)
        {

            var modalInstance = $uibModal.open({
                template: '<pdf-viewer delegate-handle="relativity-special-general-theory" url="modalCtrl.pdfUrl"scale="1"></pdf-viewer>',
                controller: 'ModalPdfController',
                controllerAs: 'modalCtrl',
                size: size

            });

            modalInstance.result.then(function (selectedItem)
            {
                ctrl.selected = selectedItem;
            }, function ()
            {

            });
        };

        ////////////////////////////////////

        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.addInvoicePerson = addInvoicePerson;
        ctrl.findContractor = findContractor;
    }

    angular.module('app').controller('AddInvoiceController', ['InvoiceDAO', 'CompanyDAO', '$uibModal', AddInvoiceController]);

})();
