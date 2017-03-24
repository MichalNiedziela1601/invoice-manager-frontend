(function ()
{
    'use strict';

    function AddInvoiceController(Upload, InvoiceDAO, CompanyDAO, $uibModal)
    {
        var ctrl = this;
        ctrl.transationType = null;
        ctrl.showAddInvoice = false;
        ctrl.nipContractor = null;
        ctrl.invoiceCompany = {};
        ctrl.invoicePerson = {};
        ctrl.companyDetails = {};
        ctrl.url = true;

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
        function checkTypeTransaction(invoice)
        {
            if ('sell' === ctrl.transationType) {
                invoice.companyDealer = ctrl.mockedCompany.id;
                invoice.companyRecipent = ctrl.companyDetails.id;
            } else {
                invoice.companyDealer = ctrl.companyDetails.id;
                invoice.companyRecipent = ctrl.mockedCompany.id;
            }
        }

        function addInvoiceCompany()
        {
            ctrl.invoiceCompany.type = ctrl.transationType;
            ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
            ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
            checkTypeTransaction(ctrl.invoiceCompany);

            Upload.upload({
                url: '/api/invoice',
                data: {
                    invoice: ctrl.invoiceCompany,
                    file: ctrl.file
                }
            }).then(function ()
            {
                ctrl.invoiceCompany = {};
            }).catch(function(error){
                console.error(error);
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
                ctrl.showButton = false;
                ctrl.companyDetails = result;
            }).catch(function ()
            {
                ctrl.showAlert = true;
                ctrl.showButton = true;
                ctrl.showBox = false;

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
                CompanyDAO.findByNip(compDetails.nip).then(function (result)
                {
                    ctrl.companyDetails = result;
                    ctrl.showBox = true;
                });
            });
        };

        ////////////////////////////////////

        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.addInvoicePerson = addInvoicePerson;
        ctrl.findContractor = findContractor;
    }

    angular.module('app').controller('AddInvoiceController', ['Upload', 'InvoiceDAO', 'CompanyDAO', '$uibModal', AddInvoiceController]);

})();
