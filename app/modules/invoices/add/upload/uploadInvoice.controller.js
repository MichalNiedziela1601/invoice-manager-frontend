(function ()
{
    'use strict';

    function UploadInvoiceController(Upload, InvoiceDAO, $window)
    {
        var ctrl = this;
        ctrl.showAddInvoice = false;
        ctrl.nipContractor = null;
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.invoiceCompany = {
            status: 'unpaid',
            products: {},
            reverseCharge: false,
            paymentMethod: ctrl.payment[1].type,
            dealerAccountNr: null
        };
        ctrl.companyDetails = null;
        ctrl.url = true;
        ctrl.companyNotChosen = false;
        ctrl.noResults = false;
        ctrl.formInvalidAlert = false;
        ctrl.formSubmitted = false;
        ctrl.showLoader = false;
        ctrl.showBox = false;
        ctrl.showAccountNotChosen = false;

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


        function getInvoiceNumber()
        {
            var year = ctrl.createDatePicker.date.getFullYear();
            var month = ctrl.createDatePicker.date.getMonth() + 1;
            InvoiceDAO.number(year, month, 'buy').then(function (number)
            {
                ctrl.invoiceCompany.invoiceNr = 'FV ' + year + '/' + month + '/' + number.number;
            }).catch(function (error)
            {
                console.log('error', error);
            });
        }

        ctrl.calculateNettoBrutto = function ()
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
                ctrl.invoiceCompany.bruttoValue = Number(Math.round(brutto + 'e2') + 'e-2');
            }
        };

        function checkTypeTansaction(){
            if('bank transfer' === ctrl.invoiceCompany.paymentMethod){
                return (ctrl.companyDetails.bankAccounts && Object.keys(ctrl.companyDetails.bankAccounts).length > 0 && !!ctrl.invoiceCompany.dealerAccountNr);
            } else if ('cash' === ctrl.invoiceCompany.paymentMethod) {
                ctrl.invoiceCompany.dealerAccountNr = null;
                return true;
            }
        }

        function addInvoiceCompany(form)
        {
            if (ctrl.companyDetails) {
                ctrl.invoiceCompany.type = 'buy';
                ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.companyRecipent = ctrl.mockedCompany.id;
                if ('company' === ctrl.invoiceCompany.contractorType) {
                    ctrl.invoiceCompany.companyDealer = ctrl.companyDetails.id;
                } else if ('person' === ctrl.invoiceCompany.contractorType) {
                    ctrl.invoiceCompany.personDealer = ctrl.companyDetails.id;
                }

                ctrl.fileToUpload = {
                    url: '/api/invoice/upload',
                    data: {
                        invoice: ctrl.invoiceCompany,
                        file: ctrl.file
                    }
                };
                if (form.$valid) {
                    if(checkTypeTansaction()) {
                        if (!ctrl.formSubmitted) {
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
                                    status: 'unpaid',
                                    products: {},
                                    reverseCharge: false,
                                    paymentMethod: ctrl.payment[1].type
                                };
                                ctrl.file = null;
                                form.$setPristine();
                                ctrl.formSubmitted = false;
                                ctrl.showBox = false;
                                ctrl.getInvoiceNumber();
                            }).catch(function (error)
                            {
                                ctrl.showLoader = false;
                                ctrl.errorMessage = error.data;
                                ctrl.formInvalidAlert = !ctrl.formInvalidAlert;
                                ctrl.formSubmitted = false;
                            });
                        }
                    } else {
                        ctrl.showAccountNotChosen = true;
                    }
                }
            } else {
                ctrl.companyNotChosen = true;
            }
        }

        function closeNoCompanyAlert()
        {
            ctrl.companyNotChosen = false;
        }

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

        ctrl.closeAccountNotChosen = function(){
            ctrl.showAccountNotChosen = false;
        };

        getInvoiceNumber();
        getUserInfo();

        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.closeNoCompanyAlert = closeNoCompanyAlert;
        ctrl.closeAddInvoiceSuccess = closeAddInvoiceSuccess;
        ctrl.getUserInfo = getUserInfo;
        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.getInvoiceNumber = getInvoiceNumber;

    }

    angular.module('app').controller('UploadInvoiceController', ['Upload', 'InvoiceDAO', '$window', UploadInvoiceController]);

})();
