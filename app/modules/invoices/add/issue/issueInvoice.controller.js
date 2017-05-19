(function ()
{
    'use strict';

    function IssueInvoiceController(CompanyDAO, $uibModal, UserDAO, InvoiceDAO)
    {
        var ctrl = this;

        ctrl.transationType = 'sell';
        ctrl.showAddInvoice = false;
        ctrl.nipContractor = null;
        ctrl.invoiceCompany = {
            products: {},
            status: 'unpaid'
        };
        ctrl.invoicePerson = {};
        ctrl.companyDetails = null;
        ctrl.issueCompanyNotChosen = false;
        ctrl.noResults = false;
        ctrl.formInvalidAlert = false;
        ctrl.formSubmitted = false;
        ctrl.issueProductNotAdded = false;
        ctrl.payment = [
            {type: 'cash'},
            {type: 'bank transfer'}
        ];
        ctrl.deleteCount = 0;
        ctrl.vats = [
            5, 8, 23, 'N/A'
        ];
        ctrl.editEntry = null;
        ctrl.invoiceCompany.paymentMethod = ctrl.payment[1].type;

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

        function findCompaniesByNip(nip)
        {
            return CompanyDAO.getNips(nip).then(function (response)
            {
                angular.forEach(response, function (value, key)
                {
                    if (value.nip === ctrl.mockedCompany.nip) {
                        response.splice(key, 1);
                    }
                });
                return response;
            });
        }

        function onSelect($item)
        {
            ctrl.nipContractor = $item.nip;
            ctrl.findContractor();
        }

        function getUserInfo()
        {
            UserDAO.getUserInfo().then(function (userInfo)
            {
                ctrl.mockedCompany = userInfo;
            });
        }

        ctrl.calculateBrutto = function (entry)
        {
            if ('N/A' !== entry.vat) {

                if (!isNaN(entry.netto) && !isNaN(entry.vat) && !isNaN(entry.amount)) {
                    var brutto = Number((entry.netto * entry.amount * (1 + entry.vat / 100)).toFixed(2));
                    entry.brutto = brutto;

                }
            } else {
                if (undefined === entry.amount || null === entry.amount || '' === entry.amount) {
                    entry.brutto = entry.netto;
                } else {
                    entry.brutto = Number((entry.netto * entry.amount).toFixed(2));
                }
            }
        };

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

        function deleteProduct(key)
        {
            delete ctrl.invoiceCompany.products[key];
        }

        function addInvoiceCompany(form)
        {
            if (ctrl.companyDetails) {
                ctrl.invoiceCompany.type = ctrl.transationType;
                ctrl.invoiceCompany.companyDealer = ctrl.mockedCompany.id;
                ctrl.invoiceCompany.companyRecipent = ctrl.companyDetails.id;
                ctrl.invoiceCompany.createDate = ctrl.createDatePicker.date.toISOString().slice(0, 10);
                ctrl.invoiceCompany.executionEndDate = ctrl.executionDatePicker.date.toISOString().slice(0, 10);

                if (Object.keys(ctrl.invoiceCompany.products).length > 0) {
                    if (form.$valid) {
                        if (!ctrl.formSubmitted) {
                            ctrl.formSubmitted = true;
                            InvoiceDAO.issue(ctrl.invoiceCompany).then(function ()
                            {
                                ctrl.issueCompanyNotChosen = false;
                                ctrl.addInvoice = true;
                                ctrl.createDatePicker.date = new Date();
                                ctrl.executionDatePicker.date = new Date();
                                ctrl.invoiceCompany = {
                                    products: {},
                                    status: 'unpaid'
                                };
                                ctrl.invoiceCompany.paymentMethod = ctrl.payment[1].type;
                                form.$setPristine();
                                ctrl.formSubmitted = false;
                                getInvoiceNumber();
                            }).catch(function (error)
                            {
                                ctrl.formSubmitted = false;
                                ctrl.errorMessage = error.data;
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

        ctrl.edit = function (entry)
        {
            ctrl.editEntry = angular.copy(entry);
            entry.editMode = true;
        };

        ctrl.save = function (entry)
        {
            entry.editMode = false;
            ctrl.editEntry = null;
            ctrl.calculateNettoBrutto();
        };

        ctrl.cancel = function (entry, key)
        {
            entry.editMode = false;

            if (ctrl.editEntry !== null) {
                ctrl.invoiceCompany.products[key] = ctrl.editEntry;
                ctrl.editEntry = null;
            } else {
                delete ctrl.invoiceCompany.products[key];
            }
        };

        ctrl.addNew = function ()
        {
            var keys = Object.keys(ctrl.invoiceCompany.products);
            var len = keys.length;
            ctrl.invoiceCompany.products[len] = {editMode: true};
        };

        getInvoiceNumber();
        getUserInfo();

        ctrl.findContractor = findContractor;
        ctrl.closeNoCompanyAlert = closeNoCompanyAlert;
        ctrl.closeAddInvoiceSuccess = closeAddInvoiceSuccess;
        ctrl.findCompaniesByNip = findCompaniesByNip;
        ctrl.onSelect = onSelect;
        ctrl.getUserInfo = getUserInfo;
        ctrl.closeFormInvalidAlert = closeFormInvalidAlert;
        ctrl.deleteProduct = deleteProduct;
        ctrl.addInvoiceCompany = addInvoiceCompany;
        ctrl.calculateNettoBrutto = calculateNettoBrutto;
        ctrl.getInvoiceNumber = getInvoiceNumber;
        ctrl.closeProductNotAdded = closeProductNotAdded;
    }

    angular.module('app')
            .controller('IssueInvoiceController', ['CompanyDAO', '$uibModal', 'UserDAO', 'InvoiceDAO', IssueInvoiceController]);


})();
