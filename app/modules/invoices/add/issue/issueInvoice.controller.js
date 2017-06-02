(function ()
{
    'use strict';

    function IssueInvoiceController(CompanyDAO, $uibModal, InvoiceDAO, $window)
    {
        var ctrl = this;

        ctrl.transationType = 'sell';
        ctrl.showAddInvoice = false;
        ctrl.invoiceCompany = {
            products: {},
            status: 'unpaid',
            reverseCharge: false,
            showAmount: false
        };
        ctrl.companyDetails = null;
        ctrl.issueCompanyNotChosen = false;
        ctrl.noResultsCompany = false;
        ctrl.noResultsPerson = false;
        ctrl.formInvalidAlert = false;
        ctrl.formSubmitted = false;
        ctrl.issueProductNotAdded = false;
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.deleteCount = 0;

        ctrl.showLoader = false;
        ctrl.invoiceCompany.paymentMethod = ctrl.payment[1].type;
        ctrl.contractorType = '';
        ctrl.showBox = false;

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

        function closeNoCompanyAlert()
        {
            ctrl.issueCompanyNotChosen = false;
        }

        function getInvoiceNumber()
        {
            var year = ctrl.createDatePicker.date.getFullYear();
            var month = ctrl.createDatePicker.date.getMonth() + 1;
            InvoiceDAO.number(year, month).then(function (number)
            {
                ctrl.invoiceCompany.invoiceNr = 'FV ' + year + '/' + month + '/' + number.number;
            }).catch(function (error)
            {
                console.log('error', error);
            });
        }

        ctrl.openAddCompanyModal = function (size)
        {
            ctrl.noResultsCompany = !ctrl.noResultsCompany;
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
            }, function (error)
            {
                console.error('ERROR: ' + error);
            });
        };

        function closeAddInvoiceSuccess()
        {
            ctrl.addInvoice = false;
        }

        function closeFormInvalidAlert()
        {
            ctrl.formInvalidAlert = !ctrl.formInvalidAlert;
        }

        function getUserInfo()
        {
            ctrl.mockedCompany = angular.fromJson($window.sessionStorage.getItem('userInfo') || {});
        }

        function calculateNettoBrutto()
        {
            var len = Object.keys(ctrl.invoiceCompany.products).length;
            var netto = 0, brutto = 0;
            if (len > 0) {
                angular.forEach(ctrl.invoiceCompany.products, function (product)
                {
                    if (product.amount) {
                        netto += product.netto * product.amount;
                        brutto += product.brutto;
                    } else {
                        netto += product.netto;
                        brutto += product.brutto;
                    }
                });
                ctrl.invoiceCompany.nettoValue = Number(netto);
                ctrl.invoiceCompany.bruttoValue = Number(Math.round(brutto + 'e2')+'e-2');
            }
        }

        function addInvoiceCompany(form)
        {
            if (ctrl.companyDetails) {
                ctrl.invoiceCompany.type = ctrl.transationType;
                ctrl.invoiceCompany.companyDealer = ctrl.mockedCompany.id;
                if('company' === ctrl.invoiceCompany.contractorType) {
                    ctrl.invoiceCompany.companyRecipent = ctrl.companyDetails.id;
                } else if('person' === ctrl.invoiceCompany.contractorType){
                    ctrl.invoiceCompany.personRecipent = ctrl.companyDetails.id;
                }
                ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);

                if (Object.keys(ctrl.invoiceCompany.products).length > 0) {
                    if (form.$valid) {
                        if (!ctrl.formSubmitted) {
                            ctrl.formSubmitted = true;
                            ctrl.showLoader = true;
                            InvoiceDAO.issue(ctrl.invoiceCompany).then(function ()
                            {
                                ctrl.showLoader = false;
                                ctrl.issueCompanyNotChosen = false;
                                ctrl.addInvoice = true;
                                ctrl.createDatePicker.date = new Date();
                                ctrl.executionDatePicker.date = new Date();
                                ctrl.invoiceCompany = {
                                    products: {},
                                    status: 'unpaid',
                                    reverseCharge: false,
                                    showAmount: false
                                };
                                ctrl.invoiceCompany.paymentMethod = ctrl.payment[1].type;
                                form.$setPristine();
                                ctrl.formSubmitted = false;
                                ctrl.companyDetails = {};
                                ctrl.showBox = false;
                                getInvoiceNumber();
                            }).catch(function (error)
                            {
                                ctrl.showLoader = false;
                                ctrl.formSubmitted = false;
                                ctrl.errorMessage = error.data || error.message || error;
                                ctrl.formInvalidAlert = !ctrl.formInvalidAlert;
                            });
                        }
                    }
                } else {
                    ctrl.issueProductNotAdded = true;
                }
            } else {
                ctrl.issueCompanyNotChosen = true;
            }
        }

        function closeProductNotAdded()
        {
            ctrl.issueProductNotAdded = false;
        }

        getInvoiceNumber();
        getUserInfo();

        ctrl.closeNoCompanyAlert = closeNoCompanyAlert;
        ctrl.closeAddInvoiceSuccess = closeAddInvoiceSuccess;
        ctrl.getUserInfo = getUserInfo;
        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.calculateNettoBrutto = calculateNettoBrutto;
        ctrl.getInvoiceNumber = getInvoiceNumber;
        ctrl.closeProductNotAdded = closeProductNotAdded;
    }

    angular.module('app')
            .controller('IssueInvoiceController', ['CompanyDAO', '$uibModal', 'InvoiceDAO','$window', IssueInvoiceController]);


})();
