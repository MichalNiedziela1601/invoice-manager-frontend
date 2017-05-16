(function ()
{
    'use strict';

    function UploadInvoiceController(Upload, InvoiceDAO, CompanyDAO, $uibModal,$window)
    {
        var ctrl = this;
        ctrl.showAddInvoice = false;
        ctrl.nipContractor = null;
        ctrl.invoiceCompany = {
            status: 'unpaid'
        };
        ctrl.invoicePerson = {};
        ctrl.companyDetails = null;
        ctrl.url = true;
        ctrl.companyNotChosen = false;
        ctrl.noResults = false;
        ctrl.formInvalidAlert = false;
        ctrl.formSubmitted = false;
        ctrl.showLoader = false;

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


        function getInvoiceNumber(){
            var year = ctrl.createDatePicker.date.getFullYear();
            var month = ctrl.createDatePicker.date.getMonth()+1;
            InvoiceDAO.number(year,month).then(function(number){
                ctrl.invoiceCompany.invoiceNr = 'FV '+year + '/'+month +'/'+number.number;
            }).catch(function(error){
                console.log('error',error);
            });
        }

        function addInvoiceCompany(form)
        {
            if (ctrl.companyDetails) {
                ctrl.invoiceCompany.type = 'buy';
                ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.companyDealer = ctrl.companyDetails.id;
                ctrl.invoiceCompany.companyRecipent = ctrl.mockedCompany.id;

                ctrl.fileToUpload = {
                    url: '/api/invoice/upload',
                    data: {
                        invoice: ctrl.invoiceCompany,
                        file: ctrl.file
                    }
                };
                if(form.$valid) {
                    if(!ctrl.formSubmitted) {
                        ctrl.formSubmitted = true;
                        ctrl.showLoader = true;
                        Upload.upload(ctrl.fileToUpload).then(function ()
                        {
                            ctrl.showLoader = false;
                            ctrl.companyNotChosen = false;
                            ctrl.addInvoice = true;
                            ctrl.createDatePicker.date = new Date();
                            ctrl.executionDatePicker.date = new Date();
                            ctrl.invoiceCompany = {
                                status: 'unpaid'
                            };
                            ctrl.file = null;
                            form.$setPristine();
                            ctrl.formSubmitted = false;
                            ctrl.getInvoiceNumber();
                        }).catch(function (error)
                        {
                            ctrl.errorMessage = error.data;
                            ctrl.formInvalidAlert = !ctrl.formInvalidAlert;
                            ctrl.formSubmitted = false;
                        });
                    }
                }
            } else {
                ctrl.companyNotChosen= true;
            }
        }

        function closeNoCompanyAlert()
        {
            ctrl.companyNotChosen = false;
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
                ctrl.closeNoCompanyAlert();
            }).catch(function ()
            {
                ctrl.showAlert = true;
                ctrl.showButton = true;
                ctrl.showBox = false;

            });
        }

        ctrl.openAddCompanyModal = function (size)
        {
            ctrl.noResults = !ctrl.noResults;
            ctrl.modalInstance = $uibModal.open({
                templateUrl: '/modules/invoices/add/addCompanyModal/addCompanyModal.tpl.html',
                controller: 'AddCompanyModalController',
                controllerAs: 'addCompModalCtrl',
                backdrop: 'static',
                size: size
            });

            ctrl.modalInstance.result.then(function (compDetails)
            {
                CompanyDAO.findByNip(compDetails.nip).then(function (result)
                {
                    ctrl.companyDetails = result;
                    ctrl.showBox = true;
                });
            });
        };

        function closeAddInvoiceSuccess()
        {
            ctrl.addInvoice = false;
        }

        function closeFormInvalidAlert(){
            ctrl.formInvalidAlert = !ctrl.formInvalidAlert;
        }

        function findCompaniesByNip(nip)
        {
            return CompanyDAO.getNips(nip).then(function (response)
            {
                return response;
            });
        }

        function onSelect($item)
        {
            ctrl.nipContractor = $item.nip;
            ctrl.findContractor();
        }

        function getUserInfo(){
            ctrl.mockedCompany = angular.fromJson($window.sessionStorage.getItem('userInfo') || {});
        }

        getInvoiceNumber();

        getUserInfo();

        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.addInvoicePerson = addInvoicePerson;
        ctrl.findContractor = findContractor;
        ctrl.closeNoCompanyAlert = closeNoCompanyAlert;
        ctrl.closeAddInvoiceSuccess = closeAddInvoiceSuccess;
        ctrl.findCompaniesByNip = findCompaniesByNip;
        ctrl.onSelect = onSelect;
        ctrl.getUserInfo = getUserInfo;
        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.getInvoiceNumber = getInvoiceNumber;

    }

    angular.module('app').controller('UploadInvoiceController',['Upload','InvoiceDAO','CompanyDAO','$uibModal','$window',UploadInvoiceController]);

})();
