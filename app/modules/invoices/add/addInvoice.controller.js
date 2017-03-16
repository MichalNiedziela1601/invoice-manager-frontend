(function ()
{
    'use strict';

    function AddInvoiceController(InvoiceDAO, Company, $uibModal)
    {
        var ctrl = this;
        ctrl.transationType = null;
        ctrl.showAddInvoice = false;
        ctrl.showCreateCompany = false;
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

        function toggleShowCreateCompany()
        {
            ctrl.showCreateCompany = !ctrl.showCreateCompany;
        }

        function findContractor()
        {
            Company.findByNip(ctrl.nipContractor).then(function (result)
            {
                ctrl.companyDetails = result;
            });
        }

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
        ctrl.toggleShowCreateCompany = toggleShowCreateCompany;
    }

    angular.module('app').controller('AddInvoiceController', ['InvoiceDAO', 'Company', '$uibModal', AddInvoiceController]);

})();
