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
                ctrl.companyDetails = result;
            }).catch(function ()
            {
                ctrl.showAlert = true;
            });
        }

        CompanyDAO.findByNip(1224567890).then(function (result)
        {
            ctrl.mockedCompany = result;
        });

        ctrl.openAddCompanyModal = function (size)
        {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/invoices/add/addCompanyModal/addCompanyModal.tpl.html',
                controller: 'AddCompanyModalController',
                controllerAs: 'addCompModalCtrl',
                backdrop: 'static',
                size: size
            });

            modalInstance.result.then(function (compDetails)
            {
                CompanyDAO.findByNip(compDetails.nip).then(function(result){
                    ctrl.companyDetails = result;
                    ctrl.showBox = true;
                });

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
